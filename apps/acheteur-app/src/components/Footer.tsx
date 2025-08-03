import React from 'react';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Instagram, Twitter, Youtube, Mail } from 'lucide-react';
import { Separator } from '@components/ui/separator';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              COMMERCIUM
            </h3>
            <p className="text-gray-600 text-sm">
              Your ultimate Gen Z shopping destination for trendy fashion and lifestyle products.
            </p>
            <div className="flex space-x-3">
              <Button variant="outline" size="icon" className="rounded-full">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-purple-600 transition-colors">New Arrivals</a></li>
              <li><a href="#" className="hover:text-purple-600 transition-colors">Trending</a></li>
              <li><a href="#" className="hover:text-purple-600 transition-colors">Sale</a></li>
              <li><a href="#" className="hover:text-purple-600 transition-colors">Accessories</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-purple-600 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-purple-600 transition-colors">Size Guide</a></li>
              <li><a href="#" className="hover:text-purple-600 transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-purple-600 transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-sm text-gray-600 mb-3">
              Stay updated with the latest trends and exclusive offers!
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Enter your email"
                className="rounded-full"
              />
              <Button className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <Separator className="my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <p>&copy; 2024 COMMERCIUM. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-purple-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-purple-600 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
