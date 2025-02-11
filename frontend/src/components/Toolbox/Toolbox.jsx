import { Link } from "react-router-dom";

const Toolbox = ({ 
    totalProducts, 
    currentPage, 
    productsPerPage, 
    sortBy, 
    onSortChange, 
    currentLayout, 
    onLayoutChange 
}) => {
    const layouts = [
        {
            id: "1",
            svg: [
                { x: 0, y: 0, width: 4, height: 4 },
                { x: 6, y: 0, width: 10, height: 4 },
                { x: 0, y: 6, width: 4, height: 4 },
                { x: 6, y: 6, width: 10, height: 4 }
            ]
        },
        {
            id: "2",
            svg: [
                { x: 0, y: 0, width: 4, height: 4 },
                { x: 6, y: 0, width: 4, height: 4 },
                { x: 0, y: 6, width: 4, height: 4 },
                { x: 6, y: 6, width: 4, height: 4 }
            ]
        },
        {
            id: "3",
            svg: [
                { x: 0, y: 0, width: 4, height: 4 },
                { x: 6, y: 0, width: 4, height: 4 },
                { x: 12, y: 0, width: 4, height: 4 },
                { x: 0, y: 6, width: 4, height: 4 },
                { x: 6, y: 6, width: 4, height: 4 },
                { x: 12, y: 6, width: 4, height: 4 }
            ]
        },
        {
            id: "4",
            svg: [
                { x: 0, y: 0, width: 4, height: 4 },
                { x: 6, y: 0, width: 4, height: 4 },
                { x: 12, y: 0, width: 4, height: 4 },
                { x: 18, y: 0, width: 4, height: 4 },
                { x: 0, y: 6, width: 4, height: 4 },
                { x: 6, y: 6, width: 4, height: 4 },
                { x: 12, y: 6, width: 4, height: 4 },
                { x: 18, y: 6, width: 4, height: 4 }
            ]
        }
    ];
    
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const rangeStart = indexOfFirstProduct + 1;  
    const rangeEnd = Math.min(indexOfLastProduct, totalProducts);  
    
    const toPersianNumbers = (num) => {
        return String(num).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
    };

    return (
        <div className="toolbox">
            <div className="toolbox-left">
                <div className="toolbox-info">
                    نمایش <span>{toPersianNumbers(rangeStart)} - {toPersianNumbers(rangeEnd)}</span> از <span>{toPersianNumbers(totalProducts)}</span> محصول
                </div>
            </div>
            <div className="toolbox-right">
                <div className="toolbox-sort">
                    <label htmlFor="sortby">مرتب‌سازی بر اساس:</label>
                    <div className="select-custom">
                        <select
                            name="sortby"
                            id="sortby"
                            className="form-control"
                            value={sortBy}
                            onChange={(e) => onSortChange(e.target.value)}
                        >
                            <option value="popularity">محبوب‌ترین</option>
                            <option value="rating">بیشترین امتیاز</option>
                            <option value="date">تاریخ</option>
                        </select>
                    </div>
                </div>
                <div className="toolbox-layout">
                    {layouts.map(({ id, svg }) => (
                        <Link
                            key={id}
                            className={`btn-layout${currentLayout === id ? ' active' : ''}`}
                            onClick={() => onLayoutChange(id)}
                        >
                            <svg width={svg.length * 4} height="10">
                                {svg.map((rect, idx) => (
                                    <rect key={idx} x={rect.x} y={rect.y} width={rect.width} height={rect.height} />
                                ))}
                            </svg>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Toolbox;
