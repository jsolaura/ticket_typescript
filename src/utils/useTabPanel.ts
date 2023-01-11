export const panelProps = (index: number) => {
    return {
        id: `tab-${index}`,
        'aria-controls': `tabpanel-${index}`,
    };
}
