import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // При каждом изменении URL-адреса сбрасываем скролл окна на самый верх
        window.scrollTo(0, 0);
    }, [pathname]);

    return null; // Этот компонент ничего не рендерит, он просто выполняет логику
}

export default ScrollToTop;