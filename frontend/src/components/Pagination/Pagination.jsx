import './pagination.css';

const Pagination = ({ totalProducts, productsPerPage, paginate, currentPage }) => {
    // محاسبه تعداد کل صفحات
    const totalPages = Math.ceil(totalProducts / productsPerPage);

    // تولید آرایه‌ای از شماره صفحات
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    // مدیریت کلیک بر روی صفحه
    const handlePageClick = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            paginate(pageNumber); // بروزرسانی صفحه فعلی در کامپوننت والد
        }
    };

    return (
        <nav aria-label="ناوبری صفحه">
            <ul className="pagination justify-content-center">
                {/* دکمه قبلی */}
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button
                        className="page-link page-link-prev"
                        aria-label="قبلی"
                        disabled={currentPage === 1}
                        onClick={() => handlePageClick(currentPage - 1)}
                    >
                        <span aria-hidden="true">
                            <i className="icon-long-arrow-left"></i>
                        </span>
                        قبلی
                    </button>
                </li>

                {/* شماره صفحات */}
                {pageNumbers.map((page) => (
                    <li
                        key={page}
                        className={`page-item ${page === currentPage ? "active" : ""}`}
                        aria-current={page === currentPage ? "page" : undefined}
                    >
                        <button
                            className="page-link"
                            onClick={() => handlePageClick(page)}
                        >
                            {page}
                        </button>
                    </li>
                ))}

                {/* دکمه بعدی */}
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button
                        className="page-link page-link-next"
                        aria-label="بعدی"
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageClick(currentPage + 1)}
                    >
                        بعدی
                        <span aria-hidden="true">
                            <i className="icon-long-arrow-right"></i>
                        </span>
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
