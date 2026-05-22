import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Search, Zap, CheckCircle } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';

const LandingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <MainLayout>
      <div className="relative isolate pt-14 lg:pt-20">
        {/* Background gradient blob */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ffffff] to-[#404040] opacity-10 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] animate-blob"></div>
        </div>

        <motion.div 
          className="mx-auto max-w-4xl py-16 sm:py-24 lg:py-32 text-center px-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-8 flex justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-400 ring-1 ring-white/10 hover:ring-white/20 transition-all">
              Announcing our new premium verification platform. <a href="#" className="font-semibold text-white"><span className="absolute inset-0" aria-hidden="true"></span>Read more <span aria-hidden="true">&rarr;</span></a>
            </div>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl mb-6">
            Secure Internship <br />
            <span className="text-gradient">Verification System</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="mt-6 text-lg leading-8 text-gray-400 max-w-2xl mx-auto">
            A state-of-the-art platform to instantly issue and verify authentic internship credentials. Built with modern cryptographic principles for ultimate security.
          </motion.p>
          
          <motion.div variants={itemVariants} className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/verification"
              className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all transform hover:scale-105"
            >
              Verify Credential
            </Link>
            <Link to="/hr" className="text-sm font-semibold leading-6 text-white group flex items-center">
              HR Portal <span aria-hidden="true" className="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div 
          className="mx-auto max-w-7xl px-6 lg:px-8 pb-24"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                title: "Instant Verification",
                description: "Real-time lookups guarantee the authenticity of credentials with zero latency.",
                icon: Zap
              },
              {
                title: "Bank-Grade Security",
                description: "Unique alphanumeric hashes make forgery mathematically impossible.",
                icon: ShieldCheck
              },
              {
                title: "Global Search",
                description: "Find any credential worldwide simply by entering its unique code.",
                icon: Search
              }
            ].map((feature, i) => (
              <div key={i} className="glass-card rounded-3xl p-8 hover:-translate-y-2 transition-transform duration-300">
                <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default LandingPage;
