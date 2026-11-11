import json
from pathlib import Path
import tempfile
import unittest
from artifact_inventory import encode, inventory, sha256
from release_pack import build_release

class ReleaseTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name).resolve() / 'out'
        self.root.mkdir()
        (self.root/'index.html').write_text('<h1>reviewed</h1>')
        (self.root/'_headers').write_text('/*\n  Cache-Control: public\n')
        self.source = 'a'*40
        self.frozen = encode(inventory(self.root, self.source))
        self.reviewed = sha256(self.frozen)
        self.previous = {'schema':1,'site':'aiwork','sequence':0,'source_commit':self.source,'files':[]}
    def tearDown(self): self.temp.cleanup()
    def pack(self, **args):
        values=dict(export=self.root,frozen_inventory=self.frozen,reviewed_sha=self.reviewed,
                    previous_manifest=encode(self.previous),site='aiwork',sequence=1)
        values.update(args)
        return build_release(**values)
    def test_valid_manifest(self):
        m=self.pack(); self.assertEqual(m['files'][0]['before_sha256'],None)
        self.assertEqual(m['files'][0]['path'],'index.html')
    def test_exact_before_hash(self):
        self.previous['files']=[{'path':'index.html','bytes':8,'sha256':'b'*64,'before_sha256':None}]
        self.assertEqual(self.pack()['files'][0]['before_sha256'],'b'*64)
    def test_reviewed_hash_required(self):
        with self.assertRaises(ValueError): self.pack(reviewed_sha='c'*64)
    def test_rebuild_or_tamper_rejected(self):
        (self.root/'index.html').write_text('not reviewed')
        with self.assertRaises(ValueError): self.pack()
    def test_unknown_file_rejected(self):
        (self.root/'secret.php').write_text('<?php ?>')
        with self.assertRaises(ValueError): inventory(self.root,self.source)
    def test_hidden_file_rejected(self):
        (self.root/'.env').write_text('REDACTED')
        with self.assertRaises(ValueError): inventory(self.root,self.source)
    def test_hidden_directory_rejected(self):
        (self.root/'.git').mkdir()
        with self.assertRaises(ValueError): inventory(self.root,self.source)
    def test_symlink_file_rejected(self):
        (self.root/'alias.html').symlink_to(self.root/'index.html')
        with self.assertRaises(ValueError): inventory(self.root,self.source)
    def test_symlink_root_rejected(self):
        link=Path(self.temp.name).resolve()/'linked';link.symlink_to(self.root)
        with self.assertRaises(ValueError): inventory(link,self.source)
    def test_cross_site_rejected(self):
        with self.assertRaises(ValueError): self.pack(site='cake')
    def test_replay_rejected(self):
        self.previous['sequence']=1
        with self.assertRaises(ValueError): self.pack()
    def test_nonsequential_release_rejected(self):
        with self.assertRaises(ValueError): self.pack(sequence=8)
    def test_boolean_schema_rejected(self):
        self.previous['schema']=True
        with self.assertRaises(ValueError): self.pack()
    def test_duplicate_previous_path_rejected(self):
        e={'path':'index.html','bytes':8,'sha256':'b'*64,'before_sha256':None}
        self.previous['files']=[e,e]
        with self.assertRaises(ValueError): self.pack()
    def test_unknown_previous_fields_rejected(self):
        self.previous['command']='never execute'
        with self.assertRaises(ValueError): self.pack()
    def test_invalid_source_sha_rejected(self):
        with self.assertRaises(ValueError): inventory(self.root,'main')
    def test_headers_excluded_from_release(self):
        self.assertEqual(json.loads(self.frozen)['excluded'],['_headers'])
        self.assertNotIn('_headers',[x['path'] for x in self.pack()['files']])
    def test_empty_rejected(self):
        (self.root/'index.html').unlink()
        with self.assertRaises(ValueError): inventory(self.root,self.source)
    def test_zero_length_rejected(self):
        (self.root/'index.html').write_bytes(b'')
        with self.assertRaises(ValueError): inventory(self.root,self.source)
    def test_immutable_replacement_rejected(self):
        p=self.root/'_next/static/chunks/a-12345678.js';p.parent.mkdir(parents=True);p.write_text('safe asset')
        self.frozen=encode(inventory(self.root,self.source));self.reviewed=sha256(self.frozen)
        self.previous['files']=[{'path':p.relative_to(self.root).as_posix(),'bytes':5,'sha256':'c'*64,'before_sha256':None}]
        with self.assertRaises(ValueError): self.pack()
    def test_protected_path_rejected(self):
        p=self.root/'private-config';p.mkdir();(p/'config.js').write_text('no')
        with self.assertRaises(ValueError): inventory(self.root,self.source)
    def test_duplicate_json_key_rejected(self):
        with self.assertRaises(ValueError): self.pack(previous_manifest=b'{"schema":1,"schema":1}')

if __name__ == '__main__': unittest.main()
