import {useState} from "react";

const useToggleState = (initialValue: boolean): [boolean, () => void] => {
    const [isToggle, setIsToggle] = useState<boolean>(initialValue);
    const toggle = () => setIsToggle(!isToggle);
    return [isToggle, toggle];
}

export default useToggleState;