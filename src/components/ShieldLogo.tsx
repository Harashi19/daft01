const ShieldLogo = ({ className = "h-24 w-auto" }: { className?: string }) => {
  return (
    <img
      src="/logo.png"   // place logo.png inside your public/ folder
      alt="Company Logo"
      className={className}
    />
  );
};

export default ShieldLogo;
