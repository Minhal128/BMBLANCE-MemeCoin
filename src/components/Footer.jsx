import { Globe2, Sparkles } from 'lucide-react';

const InstaIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="5"></rect>
    <circle cx="12" cy="12" r="3.2"></circle>
    <circle cx="17.5" cy="6.5" r="0.5"></circle>
  </svg>
);

const RedditIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <circle cx="12" cy="12" r="4.5"></circle>
    <path d="M16 12c.5 1 1.5 1.5 2.5 1.5" />
    <path d="M8 12c-.5 1-1.5 1.5-2.5 1.5" />
    <circle cx="9.2" cy="11.2" r="0.5"></circle>
    <circle cx="14.8" cy="11.2" r="0.5"></circle>
    <path d="M18 7l-3 .8" />
    <circle cx="18" cy="7" r="0.6" />
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Tokenomics', href: '#tokenomics' },
    { name: 'Roadmap', href: '#roadmap' },
    { name: 'Charity', href: '#charity' },
    { name: 'Presale', href: '#presale' },
    { name: 'Community', href: '#community' },
  ];

  const socialLinks = [
    { icon: <RedditIcon className="w-5 h-5" />, href: 'https://ads.reddit.com/business/14749ea5-c36b-49d3-9c46-1f3da877023e', name: 'Reddit' },
    { icon: <InstaIcon className="w-5 h-5" />, href: 'https://www.instagram.com/prislupsky292/', name: 'Instagram' },
  ];

  const walletAddress = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4";

  return (
    <footer className="relative bg-charcoal border-t border-honey/20 overflow-hidden">
      <div className="absolute inset-0 honeycomb-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Sparkles className="w-10 h-10 text-honey" />
              <span className="text-2xl font-bold text-gradient">BMBLANCE</span>
            </div>
            <p className="text-text-secondary text-sm mb-4">
              The Meme Coin with a Mission — Saving the Bees, One Block at a Time.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-honey/10 hover:bg-honey/20 flex items-center justify-center text-honey transition-all hover:scale-110"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-honey mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.slice(0, 4).map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-text-secondary hover:text-honey transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h3 className="text-lg font-bold text-honey mb-4">Community</h3>
            <ul className="space-y-2">
              {quickLinks.slice(4).map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-text-secondary hover:text-honey transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contract Info */}
          <div>
            <h3 className="text-lg font-bold text-honey mb-4">Contract Address</h3>
            <div className="bg-charcoal/60 rounded-lg p-3 border border-honey/20">
              <code className="text-text-secondary text-xs break-all block">
                {walletAddress}
              </code>
            </div>
            <p className="text-text-secondary text-xs mt-3">
              Verified on BSCScan
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-honey/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-text-secondary text-sm text-center md:text-left">
              <span className="flex items-center gap-2">
                © {currentYear} BMBLANCE | Built for the Planet
                <Globe2 className="w-4 h-4 text-soft-green" />
              </span>
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-text-secondary hover:text-honey transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-text-secondary hover:text-honey transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-text-secondary hover:text-honey transition-colors">
                Disclaimer
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-center">
          <p className="text-text-secondary text-xs max-w-4xl mx-auto">
            Disclaimer: Cryptocurrency investments carry risk. BMBLANCE is a meme coin with charitable intentions. 
            Please do your own research before investing. Not financial advice.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
