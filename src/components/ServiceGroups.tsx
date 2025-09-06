import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useQuoteForm } from '@/contexts/QuoteFormContext';
import { Building2, Users, Star, MapPin, CheckCircle2, Clock, DollarSign } from 'lucide-react';

interface Vendor {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  location: string;
  specialty: string;
  avgPrice: string;
  deliveryTime: string;
  verified: boolean;
}

interface ServiceGroup {
  name: string;
  description: string;
  vendors: Vendor[];
  icon: React.ReactNode;
}

interface ServiceGroupsProps {
  serviceGroups: string[];
  onVendorSelect: (groupName: string, vendor: Vendor) => void;
  projectDescription?: string;
  formData?: any;
}

const mockVendors: { [key: string]: Vendor[] } = {
  'Real Estate': [
    { id: '1', name: 'Prime Properties Group', rating: 4.8, reviews: 127, location: 'Downtown', specialty: 'Land Development', avgPrice: '$2,500 - $5,000', deliveryTime: '2-4 weeks', verified: true },
    { id: '2', name: 'BuildLand Solutions', rating: 4.6, reviews: 89, location: 'North District', specialty: 'Residential Plots', avgPrice: '$3,000 - $6,000', deliveryTime: '1-3 weeks', verified: true },
    { id: '3', name: 'Metro Land Advisors', rating: 4.7, reviews: 203, location: 'City Center', specialty: 'Zoning & Permits', avgPrice: '$1,800 - $4,000', deliveryTime: '3-6 weeks', verified: false },
    { id: '4', name: 'Urban Development Co', rating: 4.5, reviews: 156, location: 'East Side', specialty: 'Commercial Land', avgPrice: '$4,000 - $8,000', deliveryTime: '2-5 weeks', verified: true },
    { id: '5', name: 'Green Acres Realty', rating: 4.9, reviews: 78, location: 'Suburbs', specialty: 'Eco-Friendly Lots', avgPrice: '$2,200 - $4,500', deliveryTime: '1-4 weeks', verified: true }
  ],
  'Architecture Firm': [
    { id: '6', name: 'Modern Design Studio', rating: 4.9, reviews: 67, location: 'Design District', specialty: 'Contemporary Homes', avgPrice: '$15,000 - $30,000', deliveryTime: '6-12 weeks', verified: true },
    { id: '7', name: 'Heritage Architects', rating: 4.7, reviews: 134, location: 'Historic Quarter', specialty: 'Traditional Style', avgPrice: '$12,000 - $25,000', deliveryTime: '8-14 weeks', verified: true },
    { id: '8', name: 'Eco Architecture Lab', rating: 4.8, reviews: 92, location: 'Green Valley', specialty: 'Sustainable Design', avgPrice: '$18,000 - $35,000', deliveryTime: '10-16 weeks', verified: true },
    { id: '9', name: 'Urban Planning Co', rating: 4.6, reviews: 178, location: 'Business District', specialty: 'Multi-Family Units', avgPrice: '$20,000 - $40,000', deliveryTime: '8-15 weeks', verified: false },
    { id: '10', name: 'Innovative Spaces', rating: 4.8, reviews: 89, location: 'Tech Hub', specialty: 'Smart Homes', avgPrice: '$16,000 - $32,000', deliveryTime: '7-13 weeks', verified: true }
  ],
  'Construction': [
    { id: '11', name: 'Elite Builders Inc', rating: 4.7, reviews: 234, location: 'Industrial Zone', specialty: 'Custom Homes', avgPrice: '$200 - $350/sqft', deliveryTime: '16-24 weeks', verified: true },
    { id: '12', name: 'Precision Construction', rating: 4.8, reviews: 189, location: 'North Side', specialty: 'High-End Residential', avgPrice: '$250 - $400/sqft', deliveryTime: '18-26 weeks', verified: true },
    { id: '13', name: 'Rapid Build Solutions', rating: 4.5, reviews: 298, location: 'South District', specialty: 'Fast Construction', avgPrice: '$180 - $280/sqft', deliveryTime: '12-18 weeks', verified: true },
    { id: '14', name: 'Heritage Builders', rating: 4.6, reviews: 167, location: 'Old Town', specialty: 'Traditional Methods', avgPrice: '$220 - $320/sqft', deliveryTime: '20-28 weeks', verified: false },
    { id: '15', name: 'Green Build Co', rating: 4.9, reviews: 145, location: 'Eco District', specialty: 'Sustainable Building', avgPrice: '$240 - $380/sqft', deliveryTime: '18-25 weeks', verified: true }
  ]
};

// Add more mock vendors for other service groups
const generateMockVendors = (groupName: string): Vendor[] => {
  if (mockVendors[groupName]) return mockVendors[groupName];
  
  // Use a consistent seed based on group name to avoid random changes
  const seed = groupName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  return Array.from({ length: 5 }, (_, i) => {
    const vendorSeed = seed + i;
    return {
      id: `${groupName.toLowerCase().replace(/\s+/g, '-')}-${i + 1}`,
      name: `${groupName} Pro ${i + 1}`,
      rating: 4.5 + (vendorSeed % 4) * 0.1,
      reviews: 50 + (vendorSeed % 150),
      location: ['Downtown', 'North District', 'South Area', 'East Side', 'West End'][i],
      specialty: `${groupName} Services`,
      avgPrice: '$2,000 - $5,000',
      deliveryTime: '2-6 weeks',
      verified: (vendorSeed % 10) > 3
    };
  });
};

const ServiceGroups: React.FC<ServiceGroupsProps> = ({ serviceGroups, onVendorSelect, projectDescription = '', formData = {} }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setWasRedirectedFromAuth } = useQuoteForm();
  const [selectedVendors, setSelectedVendors] = useState<{ [key: string]: string[] }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitQuotes = async () => {
    // Check if user is authenticated
    if (!user) {
      setWasRedirectedFromAuth(true);
      navigate('/auth?type=client&redirect=quote');
      return;
    }

    setIsSubmitting(true);
    
    // Create tickets for each selected vendor
    const tickets = [];
    Object.entries(selectedVendors).forEach(([groupName, vendorIds]) => {
      const vendors = generateMockVendors(groupName);
      vendorIds.forEach(vendorId => {
        const vendor = vendors.find(v => v.id === vendorId);
        if (vendor) {
          tickets.push({
            id: `ticket-${Date.now()}-${Math.random()}`,
            groupName,
            vendor,
            projectDescription,
            formData,
            status: 'pending' as const,
            createdAt: new Date()
          });
        }
      });
    });
    
    // Simulate API call for submitting quote requests
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    
    // Navigate to tickets page with created tickets
    navigate('/tickets', { state: { tickets } });
  };

  const getTotalSelections = () => {
    return Object.values(selectedVendors).flat().length;
  };

  const handleVendorToggle = (groupName: string, vendor: Vendor) => {
    const groupSelections = selectedVendors[groupName] || [];
    const isSelected = groupSelections.includes(vendor.id);

    if (isSelected) {
      setSelectedVendors({
        ...selectedVendors,
        [groupName]: groupSelections.filter(id => id !== vendor.id)
      });
    } else {
      setSelectedVendors({
        ...selectedVendors,
        [groupName]: [...groupSelections, vendor.id]
      });
      onVendorSelect(groupName, vendor);
    }
  };

  const getGroupIcon = (groupName: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      'Real Estate': <Building2 className="w-5 h-5" />,
      'Architecture Firm': <Users className="w-5 h-5" />,
      'Construction': <Building2 className="w-5 h-5" />,
      'Lawyer': <Users className="w-5 h-5" />,
      'Electrical': <Users className="w-5 h-5" />,
      'Mechanical': <Users className="w-5 h-5" />,
      'Pool Construction': <Users className="w-5 h-5" />,
      'Landscaping': <Users className="w-5 h-5" />,
      'Furniture': <Users className="w-5 h-5" />,
      'Lighting and Fixtures': <Users className="w-5 h-5" />
    };
    return icons[groupName] || <Users className="w-5 h-5" />;
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Your Matched Service Providers
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Based on your project requirements, here are the top professionals in each category. 
          Select the ones you'd like to receive quotes from.
        </p>
      </div>

      <div className="grid gap-8">
        {serviceGroups.map((groupName) => {
          const vendors = generateMockVendors(groupName);
          const groupSelections = selectedVendors[groupName] || [];

          return (
            <Card key={groupName} className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-xl">
                  {getGroupIcon(groupName)}
                  <span>{groupName}</span>
                  {groupSelections.length > 0 && (
                    <Badge variant="secondary" className="ml-auto">
                      {groupSelections.length} selected
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="grid gap-4">
                  {vendors.map((vendor, index) => {
                    const isSelected = groupSelections.includes(vendor.id);
                    
                    return (
                      <div
                        key={vendor.id}
                        className={`p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
                          isSelected 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => handleVendorToggle(groupName, vendor)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold text-lg">{vendor.name}</h3>
                              {vendor.verified && (
                                <CheckCircle2 className="w-4 h-4 text-accent" />
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 fill-blue-400 text-blue-400" />
                                <span className="font-medium">{vendor.rating.toFixed(1)}</span>
                                <span>({vendor.reviews} reviews)</span>
                              </div>
                              
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>{vendor.location}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-6 text-sm">
                              <div className="flex items-center space-x-1">
                                <DollarSign className="w-4 h-4 text-accent" />
                                <span className="font-medium">{vendor.avgPrice}</span>
                              </div>
                              
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4 text-primary" />
                                <span>{vendor.deliveryTime}</span>
                              </div>
                            </div>
                            
                            <Badge variant="outline" className="text-xs">
                              {vendor.specialty}
                            </Badge>
                          </div>
                          
                          <Button
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            className={isSelected ? "bg-gradient-primary border-0" : ""}
                          >
                            {isSelected ? 'Selected' : 'Select'}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {Object.values(selectedVendors).some(arr => arr.length > 0) && (
        <Card className="bg-gradient-hero border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              {submitted ? (
                <div className="space-y-4">
                  <CheckCircle2 className="w-16 h-16 text-accent mx-auto" />
                  <h3 className="text-xl font-semibold text-accent">Quote Requests Submitted!</h3>
                  <p className="text-muted-foreground">
                    Your requests have been sent to {getTotalSelections()} service providers. 
                    They will respond within 24 hours with detailed quotes.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Ready to Request Quotes?</h3>
                  <p className="text-muted-foreground">
                    You've selected {getTotalSelections()} service providers. 
                    We'll create individual tickets for each selection and vendors will respond within 24 hours.
                  </p>
                  <Button 
                    size="lg" 
                    className="bg-gradient-primary border-0"
                    onClick={handleSubmitQuotes}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Quote Requests'}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ServiceGroups;