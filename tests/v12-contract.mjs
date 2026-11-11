import {productCopyFiles, productAddedFiles} from "./product-copy-contract.mjs";
// Project only v13's zero-specificity input guards/additive fallback out of CSS.
// input-modality.test.mjs independently checks these exact transformations and
// their full v12 hashes. Historical v8-v12 behavior contracts remain unchanged.
export const addedRuntime = ['app/components/mouse-input.ts', ...productAddedFiles];
export const changedRuntime = ['app/components/GlobalInteractions.tsx',...productCopyFiles];
export function v12Css(source) {
  return source.split('/* V13 actual mouse:')[0].trimEnd().replaceAll(':where(:root:not([data-aiwork-input="off"])) ', '')
    .replaceAll(':where(:not([data-aiwork-input="off"]))', '')
    .replaceAll(':where(:not(:disabled,:disabled *,[aria-disabled="true"],[aria-disabled="true"] *,[hidden],[hidden] *,[inert],[inert] *,.browser-preview,.browser-preview *))', '') + '\n';
}
