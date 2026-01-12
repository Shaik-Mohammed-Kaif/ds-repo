import React from 'react';
import { Users, Award, Leaf, Target, Heart, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const About = () => {
  const values = [
    {
      icon: Leaf,
      title: 'Sustainability',
      description: 'Committed to reducing carbon footprint through clean, electric transportation solutions.',
    },
    {
      icon: Award,
      title: 'Innovation',
      description: 'Constantly pushing boundaries with cutting-edge technology and design excellence.',
    },
    {
      icon: Heart,
      title: 'Community',
      description: 'Building a passionate community of riders who share our vision for sustainable mobility.',
    },
    {
      icon: Shield,
      title: 'Quality',
      description: 'Uncompromising quality in every component, backed by comprehensive warranties.',
    },
  ];

  const team = [
    {
      name: 'Sarah Chen',
      title: 'CEO & Founder',
      description: 'Former Tesla engineer with 15+ years in electric vehicle technology.',
    },
    {
      name: 'Marcus Johnson',
      title: 'CTO',
      description: 'Led development teams at major bike manufacturers, expert in motor systems.',
    },
    {
      name: 'Elena Rodriguez',
      title: 'Head of Design',
      description: 'Award-winning industrial designer focused on sustainable transportation.',
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-6 bg-white/20 text-white border-white/30">
            Our Story
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Revolutionizing Urban Mobility
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-4xl mx-auto leading-relaxed">
            Founded in 2019, EcoBike was born from a simple mission: to make sustainable 
            transportation accessible, enjoyable, and efficient for everyone.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
                Our Mission
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Building a Greener Future, One Ride at a Time
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                At EcoBike, we believe that the future of transportation is electric. Our mission 
                is to accelerate the world's transition to sustainable mobility by creating the 
                most advanced, reliable, and enjoyable electric bikes on the market.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Every bike we design combines cutting-edge technology with timeless craftsmanship, 
                ensuring that our riders don't just commute – they experience the joy of riding 
                while contributing to a cleaner planet.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-card rounded-2xl flex items-center justify-center shadow-soft">
                <Target className="h-24 w-24 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-accent/10 text-accent border-accent/20">
              Our Values
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What Drives Us Forward
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Our core values guide every decision we make, from product development 
              to customer service and beyond.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover-lift bg-gradient-card border-0 shadow-card">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                      <value.icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              Meet the Team
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              The Innovators Behind EcoBike
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Our diverse team of engineers, designers, and sustainability experts 
              work together to create the future of electric mobility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover-lift bg-gradient-card border-0 shadow-card">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
                      <Users className="h-10 w-10 text-muted-foreground" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-primary font-medium mb-4">{member.title}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Our Impact So Far
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Together with our community, we're making a real difference in sustainable transportation.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">2M+</div>
              <div className="text-muted-foreground">Miles Ridden</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">50K</div>
              <div className="text-muted-foreground">CO₂ Tons Saved</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">15+</div>
              <div className="text-muted-foreground">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">99%</div>
              <div className="text-muted-foreground">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;