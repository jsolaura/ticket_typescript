const durationFormat = (value: number) => {
    const minute = Math.floor(value / 60);
    const secondLeft = value - minute * 60;
    return `0${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
}
export default durationFormat;