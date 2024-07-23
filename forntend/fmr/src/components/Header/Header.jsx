import { Link } from "react-router-dom";
import "./header.css";

function Header() {
    return (
        <>
            <div className="navbarBgDark sticky-top" data-bs-theme="dark">
                <nav
                    className=" navbar-expand-lg justify-content-center white"
                    height="50px"
                >
                    <button
                        className="navbar-toggler pt-3 pb-3"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNavDropdown"
                        aria-controls="navbarNavDropdown"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                        style={{ color: "white", marginLeft: "-10px" }}
                    >
                        <i className="fas fa-bars "></i>
                        <div className="col-8 text-white float-right text-right">Find my bus stop</div>
                    </button>

                    <div
                        className="Navvybar collapse navbar-collapse justify-content-between"
                        id="navbarNavDropdown"
                    >
                        <ul className="navbar-nav text-uppercase pt-3 pb-3">
                            <li className="nav-item">
                                <Link className="nav-link active pe-3" to="/">
                                    Home
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link px-lg-3" to="/about">
                                    About
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link px-lg-3" to="/service">
                                    Service
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link px-lg-3" to="/contact">
                                    Contact
                                </Link>
                            </li>
                        </ul>

                    </div>
                </nav>
            </div>
        </>
    );
}

export default Header;
