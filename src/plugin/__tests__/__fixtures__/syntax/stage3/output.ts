type Customer = {
  name: string;
  details: {
    age?: number;
    location?: string;
    address?: {
      city: string;
    };
  };
};

let customer: Customer = {
  name: 'Carl',
  details: {
    age: 82,
    location: 'Paradise Falls'
  }
};
// Optional chaining
let customerCity = customer.details?.address?.city;

// Nullish coalescing
let customerAge = customer.details.age ?? 'Unknown age';
