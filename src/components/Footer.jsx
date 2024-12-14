const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 border-t border-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col  justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="Logo" className="h-8" />
            <span>&copy; 2024 Safe Wash. Tous droits réservés.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
