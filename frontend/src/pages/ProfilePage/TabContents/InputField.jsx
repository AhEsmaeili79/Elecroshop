const InputField = ({ label, type, name, value, onChange, required, readOnly, autoComplete }) => {
    return (
        <>
            <label>{label}</label>
            <input
                type={type}
                className="form-control rounded-lg"
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                readOnly={readOnly}
                autoComplete={autoComplete}
            />
        </>
    );
};

export default InputField;
