export interface WrapperInterface {
    isCorrect?: boolean;
    marginBottom: string;
}

export interface FieldInterface {
    id: string;
    maxlength?: string;
    fontSize?: string;
    height?: string;
    value: string;
    fullWidth?: string;
    placeholder?: string;
    onKeyDown(e: React.KeyboardEvent): void;
    onChange(e: React.ChangeEvent<HTMLInputElement>): void;
    isCorrect?: boolean;
    disabled?: boolean;
}

export interface IconInterface {
    rightAbsPosition?: string;
    leftAbsPosition?: string;
    onClick?(): void;
}

export interface Props {
    className?: string;
    placeholder?: string;
    onChange(v: string): void;
    value: string;
    rightIconCross?: string;
    rightIconCrossClickHandler?(): void;
    rightIconLock?: boolean;
    isCorrect?: boolean;
    type?: string;
    fullWidth?: string;
    fontSize?: string;
    height?: string;
    rightIcon?: string | boolean;
    typePassword?: boolean;
    hideHandler?(): void;
    hideState?: boolean;
    marginBottom?: string;
    maxlength?: string;
    blockInvalidChar?: string;
    id: string;
    mt?: string;
    mr?: string;
    rightAbsPosition?: boolean;
    leftAbsPosition?: boolean;
    disabled?: boolean;
}
