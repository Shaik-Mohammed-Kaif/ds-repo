import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Battery, Zap, Shield, Award, Users, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import HeroSection from '@/components/home/HeroSection';
import BikeCard from '@/components/bikes/BikeCard';
import { bikes } from '@/data/bikes';

const Home = () => {
  const featuredBikes = bikes.filter(bike => bike.isFeatured).slice(0, 3);
  
  const features = [
    {
      icon: Battery,
      title: 'Long-Range Battery',
      description: 'Up to 100 miles on a single charge with our advanced lithium-ion technology.',
      color: 'text-primary'
    },
    {
      icon: Zap,
      title: 'Powerful Motors',
      description: 'High-performance motors delivering smooth acceleration and hill-climbing power.',
      color: 'text-accent'
    },
    {
      icon: Shield,
      title: 'Premium Build',
      description: 'Weather-resistant design with premium components built to last.',
      color: 'text-primary'
    }
  ];

  const stats = [
    { icon: Users, value: '10,000+', label: 'Happy Riders' },
    { icon: Award, value: '25+', label: 'Awards Won' },
    { icon: MapPin, value: '50+', label: 'Service Centers' },
    { icon: Battery, value: '99.8%', label: 'Uptime Rate' }
  ];

  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              Why Choose EcoBike
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Engineered for Excellence
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Every EcoBike is designed with cutting-edge technology and premium materials 
              to deliver an unmatched riding experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover-lift bg-gradient-card border-0 shadow-card">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                      <feature.icon className={`h-8 w-8 ${feature.color}`} />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Bikes Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-accent/10 text-accent border-accent/20">
              Featured Collection
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Our Most Popular E-Bikes
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover our top-rated electric bikes that combine performance, 
              comfort, and style for the ultimate riding experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredBikes.map((bike) => (
              <BikeCard key={bike.id} bike={bike} />
            ))}
          </div>

          <div className="text-center">
            <Link to="/bikes">
              <Button className="btn-primary text-lg px-8 py-3 h-auto">
                View All Bikes
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Join our growing community of riders who have chosen EcoBike 
              for their sustainable transportation needs.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your E-Bike Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
            Experience the future of transportation with our premium electric bikes. 
            Free shipping, 2-year warranty, and 30-day money-back guarantee.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/bikes">
              <Button 
                variant="secondary" 
                className="text-lg px-8 py-3 h-auto bg-white text-primary hover:bg-white/90"
              >
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button 
                variant="outline" 
                className="text-lg px-8 py-3 h-auto border-white/30 text-white hover:bg-white/10"
              >
                Get Expert Advice
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;