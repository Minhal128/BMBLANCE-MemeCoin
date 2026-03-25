import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from './ui/button';
import { Users as UsersIcon, Headphones, Gift, Vote, Sparkles } from 'lucide-react';

const InstaIcon = ({ className = 'w-8 h-8' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="5"></rect>
    <circle cx="12" cy="12" r="3.2"></circle>
    <circle cx="17.5" cy="6.5" r="0.5"></circle>
  </svg>
);
import CountUp from 'react-countup';

const Community = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handleSocialClick = (platform) => {
    const links = {
      Reddit: "https://ads.reddit.com/business/14749ea5-c36b-49d3-9c46-1f3da877023e",
      Instagram: "https://www.instagram.com/prislupsky292/"
    };
    if (links[platform]) {
      window.open(links[platform], '_blank');
    }
  };

  const socialLinks = [
    {
      name: "Reddit",
      icon: <UsersIcon className="w-8 h-8" />,
      followers: "8K+",
      color: "from-orange-400 to-red-600",
      link: "https://ads.reddit.com/business/14749ea5-c36b-49d3-9c46-1f3da877023e"
    },
    {
      name: "Instagram",
      icon: <InstaIcon className="w-8 h-8" />,
      followers: "",
      color: "from-pink-400 to-pink-600",
      link: "https://www.instagram.com/prislupsky292/"
    }
  ];

  const communityStats = [
    { value: 45000, label: "Community Members", suffix: "+" },
    { value: 127, label: "Countries", suffix: "" },
    { value: 98, label: "Satisfaction Rate", suffix: "%" }
  ];

  return (
    <section id="community" className="py-20 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/90 via-charcoal to-charcoal/95"></div>
      <div className="absolute inset-0 honeycomb-pattern opacity-5"></div>

      <div ref={ref} className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-gradient">
            Join the Hive
          </h2>
          <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto">
            Be part of a growing community dedicated to saving bees and changing the world
          </p>
        </motion.div>

        {/* Community Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {communityStats.map((stat, index) => (
            <div
              key={stat.label}
              className="bg-gradient-to-br from-honey/10 to-soft-green/10 backdrop-blur-sm rounded-xl p-8 border border-honey/20 text-center"
            >
              <div className="text-5xl font-bold text-honey mb-2">
                {isInView && (
                  <>
                    <CountUp end={stat.value} duration={2.5} separator="," />
                    {stat.suffix}
                  </>
                )}
              </div>
              <div className="text-text-secondary font-medium">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Social Links Grid */}
        <div className="flex flex-col sm:flex-row gap-6 mb-16 justify-center items-center">
          {socialLinks.map((social, index) => (
            <motion.div
              key={social.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl cursor-pointer max-w-md w-full"
              onClick={() => handleSocialClick(social.name)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${social.color} opacity-80 group-hover:opacity-100 transition-opacity`}></div>
              <div className="relative p-8 text-center">
                <div className="text-white mb-4 flex justify-center group-hover:scale-110 transition-transform">
                  {social.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{social.name}</h3>
                <div className="text-white/90 text-lg font-medium">{social.followers} Followers</div>
                <Button 
                  variant="ghost" 
                  className="mt-4 text-white border-white hover:bg-white hover:text-charcoal cursor-pointer"
                  onClick={() => handleSocialClick(social.name)}
                >
                  Join Now
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/*
        CTA Section (commented out per request)
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="bg-gradient-to-br from-honey/20 to-soft-green/20 backdrop-blur-sm rounded-2xl p-12 border-2 border-honey/30">
            <div className="mb-6 animate-float flex justify-center">
              <Sparkles className="w-20 h-20 text-honey" />
            </div>
            <h3 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Ready to Make an Impact?
            </h3>
            <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of bee lovers and crypto enthusiasts in our mission to save the planet, 
              one transaction at a time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 cursor-pointer"
                onClick={() => handleSocialClick('Telegram')}
              >
                Join Telegram
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-6 cursor-pointer"
                onClick={() => handleSocialClick('Twitter')}
              >
                Follow on Twitter
              </Button>
            </div>
          </div>
        </motion.div>
        */}

        {/* Community Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-charcoal/60 backdrop-blur-sm rounded-xl p-6 border border-honey/20 text-center">
            <div className="mb-3 flex justify-center">
              <Headphones className="w-10 h-10 text-honey" />
            </div>
            <h4 className="text-xl font-bold text-honey mb-2">24/7 Support</h4>
            <p className="text-text-secondary text-sm">Active community mods always ready to help</p>
          </div>
          <div className="bg-charcoal/60 backdrop-blur-sm rounded-xl p-6 border border-honey/20 text-center">
            <div className="mb-3 flex justify-center">
              <Gift className="w-10 h-10 text-honey" />
            </div>
            <h4 className="text-xl font-bold text-honey mb-2">Exclusive Rewards</h4>
            <p className="text-text-secondary text-sm">Regular giveaways and community contests</p>
          </div>
          <div className="bg-charcoal/60 backdrop-blur-sm rounded-xl p-6 border border-honey/20 text-center">
            <div className="mb-3 flex justify-center">
              <Vote className="w-10 h-10 text-honey" />
            </div>
            <h4 className="text-xl font-bold text-honey mb-2">Community Voting</h4>
            <p className="text-text-secondary text-sm">Have a say in project decisions</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Community;
