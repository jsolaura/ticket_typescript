import {ChangeEvent} from "react";

export const onChangeInput = (e: ChangeEvent<any>, input: any, setInput: any) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value })
}
