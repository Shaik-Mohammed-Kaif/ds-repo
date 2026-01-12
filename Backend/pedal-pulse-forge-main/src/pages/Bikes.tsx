import React from 'react';
import BikeGrid from '@/components/bikes/BikeGrid';

const Bikes = () => {
  return (
    <>
      
      <div className="min-h-screen pt-20">
        
        {/* Page Header */}
        <section className="py-16 bg-gradient-hero text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Premium E-Bike Collection
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed">
              Discover our complete range of electric bikes designed for every adventure, 
              from mountain trails to city streets.
            </p>
          </div>
        </section>

        {/* Bikes Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <BikeGrid />
          </div>
        </section>
      </div>
    </>
  );
};

export default Bikes;