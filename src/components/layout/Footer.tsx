export default function Footer() {
  return (
    <footer className="border-t border-border py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6 text-center text-text-secondary text-sm">
        <p className="font-heading text-gold text-lg mb-2">ToRoMe</p>
        <p>&copy; {new Date().getFullYear()} ToRoMe Store. All rights reserved.</p>
      </div>
    </footer>
  );
}
