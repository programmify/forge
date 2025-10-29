import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PAYMENT_GATEWAYS = [
  { name: "Stripe", badge: "Most Popular", color: "bg-blue-500/20 text-blue-400 border-blue-500/50" },
  { name: "Polar", badge: "Developer Friendly", color: "bg-purple-500/20 text-purple-400 border-purple-500/50" },
  { name: "LemonSqueezy", badge: "Easy Setup", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50" },
  { name: "Selar", badge: "African Market", color: "bg-green-500/20 text-green-400 border-green-500/50" },
  { name: "Gumroad", badge: "Creator Focused", color: "bg-pink-500/20 text-pink-400 border-pink-500/50" },
  { name: "PayPal", badge: "Global Reach", color: "bg-indigo-500/20 text-indigo-400 border-indigo-500/50" },
  { name: "Paystack", badge: "African & Global", color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/50" },
  { name: "Flutterwave", badge: "Multi-Currency", color: "bg-orange-500/20 text-orange-400 border-orange-500/50" },
];

interface PaymentGatewaySelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export const PaymentGatewaySelector = ({ value, onChange }: PaymentGatewaySelectorProps) => {
  const toggleGateway = (gateway: string) => {
    if (value.includes(gateway)) {
      onChange(value.filter((g) => g !== gateway));
    } else {
      onChange([...value, gateway]);
    }
  };

  return (
    <Card className="p-6 glass-effect border-primary/20">
      <h3 className="text-sm font-medium mb-3">Payment Gateways</h3>
      <div className="grid grid-cols-2 gap-3">
        {PAYMENT_GATEWAYS.map((gateway) => (
          <div
            key={gateway.name}
            onClick={() => toggleGateway(gateway.name)}
            className={`
              p-3 rounded-lg border-2 cursor-pointer transition-all hover:scale-105
              ${value.includes(gateway.name) 
                ? 'border-primary bg-primary/10' 
                : 'border-border/50 bg-background/50'
              }
            `}
          >
            <div className="font-medium text-sm mb-1">{gateway.name}</div>
            <Badge variant="outline" className={`text-xs ${gateway.color}`}>
              {gateway.badge}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
};
