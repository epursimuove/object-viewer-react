export function TextInput({
    currentValue = "",
    size = 15,
    onChange,
    disabled = false,
}: {
    currentValue?: string;
    size?: number;
    // onChange: (id: string, field: string, value: string) => void;
    onChange: (value: string) => void;
    disabled?: boolean;
}) {
    return (
        <section className="text-input">
            <input
                disabled={disabled}
                // className="text-input"
                // autoFocus
                // ref={inputElementRef}
                type="text"
                // name={htmlIdentifier}
                // id={htmlIdentifier}
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
