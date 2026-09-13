export function TextInput({
    label,
    currentValue = "",
    size = 15,
    onChange,
    disabled = false,
}: {
    label?: string;
    currentValue?: string;
    size?: number;
    // onChange: (id: string, field: string, value: string) => void;
    onChange: (value: string) => void;
    disabled?: boolean;
}) {
    return (
        <section className="text-input">
            {label && <label htmlFor={label}>{label}</label>}

            <input
                disabled={disabled}
                // className="text-input"
                // autoFocus
                // ref={inputElementRef}
                type="text"
                // name={htmlIdentifier}
                id={label}
                size={size}
                value={currentValue}
                onChange={(event) => {
                    onChange(event.target.value);
                }}
            />

            {/* <span>{value}</span> */}
        </section>
    );
}
