function Footer() {
    return (
        <footer className="flex flex-row justify-between mx-auto items-center w-full mb-2 lg:flex-col gap-2">
            <div className="text-black font-semibold w-1/3 text-center lg:w-1/2 md:w-2/3 s:w-full">Holidaze – Experiences to amaze!</div>
            <a href="mailto:contact@holidaze.no" className="text-black underline font-semibold text-center w-1/3 lg:w-1/2 md:w-2/3 s:w-full">Contact@holidaze.no</a>
            <div className="text-black font-semibold text-center w-1/3 lg:w-1/2 md:w-2/3 s:w-full">All rights reserved © 2025</div>
        </footer>
    );
}

export default Footer;