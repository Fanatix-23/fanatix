import dynamic from "next/dynamic";

const Layout = dynamic(() => import("./index1"), {
    ssr: false,
});

export default Layout;