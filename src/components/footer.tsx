export default function Footer() {
    return (
        <footer className="relative bottom-0 w-full bg-transparent dark:bg-gray-800 px-6 py-4 md:flex md:items-center md:justify-between">
            <section className="mt-4 md:mt-0 text-center md:text-right text-sm text-gray-600 dark:text-gray-300">
                Powered by IEEE Computer Society VIT Chennai © {new Date().getFullYear()}
            </section>
        </footer>
    );
}
