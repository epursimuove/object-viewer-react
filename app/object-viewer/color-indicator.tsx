export function ColorIndicator({
    primaryColor,
    secondaryColor,
}: {
    primaryColor: string;
    secondaryColor?: string;
}) {
    return (
        <span className="color-indicator-wrapper">
            <span className="color-indicator-left" style={{ backgroundColor: `${primaryColor}` }}>
                &nbsp;
            </span>

            {secondaryColor && (
                <span
                    className="color-indicator-right"
                    style={{ backgroundColor: `${secondaryColor}` }}
                >
                    &nbsp;
                </span>
            )}
        </span>
    );
}
