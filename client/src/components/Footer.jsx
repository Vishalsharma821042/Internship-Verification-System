const Footer = () => {
  return (
    <footer className="border-t border-white/10 py-8 mt-12 bg-black/50">
      <div className="container mx-auto px-6 text-center text-gray-500 text-sm flex flex-col items-center justify-center">
        <div className="mb-4 flex space-x-4">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Support</a>
        </div>
        <p>&copy; {new Date().getFullYear()} InternVerify System. All rights reserved.</p>
        <p className="mt-2 text-xs text-gray-600">Built with React & Tailwind CSS</p>
      </div>
    </footer>
  );
};

export default Footer;
