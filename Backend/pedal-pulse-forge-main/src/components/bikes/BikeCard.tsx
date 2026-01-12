import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Zap, Battery, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Bike } from '@/types/bike';
import { useCart } from '@/contexts/CartContext';

interface BikeCardProps {
  bike: Bike;
}

const BikeCard: React.FC<BikeCardProps> = ({ bike }) => {
  const { addToCart, isInCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(bike);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="group product-card overflow-hidden border-0 shadow-card hover-lift bg-gradient-card">
      <div className="relative overflow-hidden">
        
        {/* Product Image */}
        <div className="aspect-[4/3] overflow-hidden bg-muted/30">
          <img
            src={bike.image}
            alt={bike.name}
            className="product-image w-full h-full object-cover transition-transform duration-500"
          />
        </div>

        {/* Overlay with quick actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center space-x-3">
          <Link to={`/bikes/${bike.id}`}>
            <Button
              variant="secondary"
              size="sm"
              className="shadow-lg hover:scale-105 transition-transform"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="shadow-lg hover:scale-105 transition-transform text-white border-white/30 hover:bg-white/10"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {bike.isNew && (
            <Badge className="bg-primary text-primary-foreground shadow-lg">
              New
            </Badge>
          )}
          {bike.originalPrice && (
            <Badge variant="destructive" className="shadow-lg">
              Save {formatPrice(bike.originalPrice - bike.price)}
            </Badge>
          )}
          {!bike.inStock && (
            <Badge variant="secondary" className="shadow-lg">
              Out of Stock
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-6">
        <div className="space-y-4">
          
          {/* Category & Name */}
          <div>
            <Badge variant="outline" className="mb-2 capitalize">
              {bike.category}
            </Badge>
            <Link to={`/bikes/${bike.id}`} className="block group">
              <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                {bike.name}
              </h3>
            </Link>
          </div>

          {/* Key Specs */}
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Battery className="h-4 w-4 text-primary" />
              <span>{bike.specs.range}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Zap className="h-4 w-4 text-primary" />
              <span>{bike.specs.topSpeed}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-muted-foreground text-sm line-clamp-2">
            {bike.description}
          </p>

          {/* Price & Actions */}
          <div className="flex items-center justify-between pt-2">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-foreground">
                  {formatPrice(bike.price)}
                </span>
                {bike.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(bike.originalPrice)}
                  </span>
                )}
              </div>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={!bike.inStock || isInCart(bike.id)}
              className={`btn-primary ${
                isInCart(bike.id) ? 'bg-green-600 hover:bg-green-700' : ''
              }`}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {isInCart(bike.id) ? 'In Cart' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BikeCard;