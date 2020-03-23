/**
 * 環境によって値が変化する想定の定数を定義する。
 * ビルド時にenv.properties.yamlのprofileを参照し、設定値をセットする。
 */
export const AppProperties = {
    // Web Api Root
    API_ROOT: '@@API_ROOT',
    ENABLE_PROD_MODE: '@@ENABLE_PROD_MODE'
};
