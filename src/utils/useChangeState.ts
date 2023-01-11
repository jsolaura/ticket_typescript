import {ChangeEvent, useState} from "react";

const useChangeState = (defaultValue: any) => {
    const [value, setValue] = useState(defaultValue);
    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    }
    return [value, onChange];
}

export default useChangeState;