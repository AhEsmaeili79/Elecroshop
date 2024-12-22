const SubmitButton = ({ loading }) => (
    <button type="submit" className="btn btn-outline-primary-2" disabled={loading}>
        <span>{loading ? 'در حال ذخیره...' : 'ذخیره تغییرات'}</span>
        <i className="icon-long-arrow-right"></i>
    </button>
);

export default SubmitButton;
