import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Star,
  MapPin,
  DollarSign,
  Calendar,
  RefreshCw
} from 'lucide-react';

interface Ticket {
  id: string;
  groupName: string;
  vendor: {
    id: string;
    name: string;
    rating: number;
    reviews: number;
    location: string;
    specialty: string;
    avgPrice: string;
    deliveryTime: string;
    verified: boolean;
  };
  projectDescription: string;
  formData?: any;
  status: 'pending' | 'quoted' | 'accepted' | 'declined' | 'completed';
  createdAt: Date;
  quotedAmount?: string;
  notes?: string;
}

const Tickets = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    // Get tickets from navigation state
    if (location.state?.tickets) {
      setTickets(location.state.tickets);
    }
  }, [location.state]);

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.groupName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, text: 'Pending Quote', icon: Clock },
      quoted: { variant: 'default' as const, text: 'Quote Received', icon: CheckCircle2 },
      accepted: { variant: 'default' as const, text: 'Accepted', icon: CheckCircle2 },
      declined: { variant: 'destructive' as const, text: 'Declined', icon: AlertCircle },
      completed: { variant: 'default' as const, text: 'Completed', icon: CheckCircle2 }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.text}
      </Badge>
    );
  };

  const handleBackToProject = () => {
    navigate('/');
  };

  const handleRefreshVendors = () => {
    // This would normally refresh the vendor data
    // For demo purposes, we'll just show a success message
    alert('Vendor data refreshed! New vendors may be available for your project.');
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={handleBackToProject}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Quote Tickets
              </h1>
              <p className="text-muted-foreground mt-1">
                Track your quote requests and vendor responses
              </p>
            </div>
          </div>
          
          <Button onClick={handleRefreshVendors} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Vendors
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search by vendor or service type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="quoted">Quoted</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tickets Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-primary">{tickets.length}</div>
              <p className="text-sm text-muted-foreground">Total Tickets</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-blue-500">
                {tickets.filter(t => t.status === 'pending').length}
              </div>
              <p className="text-sm text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-accent">
                {tickets.filter(t => t.status === 'quoted').length}
              </div>
              <p className="text-sm text-muted-foreground">Quoted</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-accent">
                {tickets.filter(t => t.status === 'accepted').length}
              </div>
              <p className="text-sm text-muted-foreground">Accepted</p>
            </CardContent>
          </Card>
        </div>

        {/* Tickets List */}
        {filteredTickets.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No tickets found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start by creating a new project to generate quote tickets'
                }
              </p>
              <Button onClick={handleBackToProject} className="bg-gradient-primary">
                Create New Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <Card key={ticket.id} className="shadow-card hover:shadow-elegant transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-lg">{ticket.vendor.name}</CardTitle>
                        {ticket.vendor.verified && (
                          <CheckCircle2 className="w-4 h-4 text-accent" />
                        )}
                        {getStatusBadge(ticket.status)}
                      </div>
                      <Badge variant="outline" className="w-fit">
                        {ticket.groupName}
                      </Badge>
                    </div>
                    
                    <div className="text-right text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {ticket.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Vendor Details */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-blue-400 text-blue-400" />
                          <span className="font-medium">{ticket.vendor.rating.toFixed(1)}</span>
                          <span className="text-muted-foreground">({ticket.vendor.reviews})</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{ticket.vendor.location}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4 text-accent" />
                          <span>{ticket.vendor.avgPrice}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4 text-primary" />
                          <span>{ticket.vendor.deliveryTime}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Project Description */}
                    <div>
                      <h4 className="font-medium mb-2">Project Description</h4>
                      <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                        {ticket.projectDescription}
                      </p>
                    </div>
                    
                    {/* Quote Information */}
                    {ticket.status === 'quoted' && ticket.quotedAmount && (
                      <div className="bg-accent/10 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-accent">Quote Received</h4>
                            <p className="text-2xl font-bold text-accent">{ticket.quotedAmount}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-gradient-primary">Accept</Button>
                            <Button size="sm" variant="outline">Negotiate</Button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Message Vendor
                      </Button>
                      {ticket.status === 'pending' && (
                        <Button variant="outline" size="sm">
                          Cancel Request
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tickets;