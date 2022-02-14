export interface MainHeadingInterface {
    className?: string;
    fw?: string;
    color?: string;
    marginBottom?: string;
}

export interface SubHeadingInterface {
    className?: string;
    textLightColor?: boolean;
    textAlign?: string;
    textAlignLast?: string;
    lineHeight?: string;
    marginTop?: string;
    mb?: string;
    ml?: string;
}

export interface WarningTextInterface {
    className?: string;
    id?: string;
    visibility?: boolean;
    ml?: string;
    mb?: string;
}

export interface MainTextInterface {
    id?: string;
    className?: string;
    color?: string;
    balOverFlow?: boolean;
}

export interface ModalTextPropsInterface {
    marginTop?: string;
    textAlign?: string;
    className?: string;
    style?: object;
}
