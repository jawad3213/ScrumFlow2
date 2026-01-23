export const TEST_STACK_DATA = {
  "analysis": {
    "project_type": "SaaS",
    "complexity_score": 8,
    "scalability_need": "High",
    "primary_constraints": [
      "Fast time-to-market",
      "High security (authentication & data)",
      "AI Integration for complex analysis",
      "Rich and interactive user interface",
      "Robust reporting and metrics"
    ],
    "key_features_summary": [
      "Secure User & Authentication Management (CRUD, JWT, password reset, profile)",
      "Project Initialization & PDF Upload (AWS S3)",
      "Dynamic Salary Grid Configuration",
      "AI-powered Backlog Generation from PDF (Epics, Stories, Tasks)",
      "AI-driven Financial & Team Estimations (costs, ROI, timeline, risks)",
      "Hierarchical Backlog Visualization with Drag & Drop prioritization",
      "Advanced Backlog Filtering & Search",
      "Sprint Creation & Planning (assign US, tasks, team capacity)", 
      "Global & Personal Kanban Boards (Drag & Drop status updates, time tracking)",
      "Multiple Task Views (List with sorting/filtering, Calendar for sprints/deadlines)",
      "Impediment Logging & Management with notifications",
      "Comprehensive Reporting (Burn-down, Velocity, financial snapshot PDF)"
    ]
  },
  "primary_recommendation": {
    "strategy_name": "The Agile AI Accelerator",
    "frontend": [
      {
        "name": "Next.js (React)",
        "category": "Frontend",
        "justification": "Leverages existing React expertise for a dynamic and rich UI, providing excellent developer experience, integrated routing, and potential for performance optimizations (SSR/SSG) if the application expands beyond internal tools.",
        "pros": [
          "Strong React ecosystem and community support",
          "Excellent developer experience with built-in features",    
          "High performance for interactive UIs",
          "Flexible for future scaling and SEO needs"
        ],
        "cons": [
          "Can be initially more complex than a vanilla React setup", 
          "Potentially larger bundle size than pure client-side apps" 
        ]
      },
      {
        "name": "Tailwind CSS + Shadcn UI",
        "category": "Tooling",
        "justification": "Accelerates UI development with a utility-first approach and provides pre-built, accessible components that can be easily customized, ensuring a consistent and modern look.",
        "pros": [
          "Rapid UI prototyping and development",
          "Highly customizable and consistent design system",
          "Small CSS bundle sizes in production"
        ],
        "cons": [
          "Can lead to verbose HTML in development",
          "Initial learning curve for utility-first paradigm"
        ]
      }
    ],
    "backend": [
      {
        "name": "Laravel (PHP)",
        "category": "Backend",
        "justification": "Explicitly mentioned in the backlog, Laravel is ideal for rapid API development, handling core CRUD operations, authentication, business logic, queues, and mail, perfectly fitting a modular monolith strategy for most features.",
        "pros": [
          "High developer productivity and robust features (ORM, Auth, Queues)",
          "Large and supportive ecosystem, extensive documentation",  
          "Strong security features out-of-the-box"
        ],
        "cons": [
          "Performance can be lower than compiled languages (Go, Rust) under extreme load",
          "PHP runtime overhead compared to more 'bare metal' solutions"
        ]
      },
      {
        "name": "FastAPI (Python)",
        "category": "Backend",
        "justification": "Dedicated microservice for the AI-driven PDF analysis, NLP with Gemini API, and complex estimation calculations. Python is the industry standard for AI/ML, and FastAPI offers high performance and a great developer experience.",
        "pros": [
          "Best-in-class for AI/ML tasks and integrations",
          "High performance with asynchronous capabilities",
          "Automatic OpenAPI documentation for API consistency"       
        ],
        "cons": [
          "Adds another language and runtime to the stack",
          "Requires careful integration and communication with the main Laravel backend"
        ]
      }
    ],
    "database": [
      {
        "name": "PostgreSQL",
        "category": "Database",
        "justification": "Explicitly mentioned and a highly robust, scalable, and feature-rich relational database, excellent for managing complex structured data like users, projects, hierarchical backlog items, and sprints.",
        "pros": [
          "ACID compliance ensures data integrity",
          "Advanced features (JSONB, full-text search, complex queries)",
          "Widely adopted and well-supported"
        ],
        "cons": [
          "Can require specialized DBA knowledge for extreme optimization",
          "Resource consumption can be higher than specialized NoSQL databases for certain use cases"
        ]
      },
      {
        "name": "MongoDB (for Logs/Events)",
        "category": "Database",
        "justification": "Optional but recommended for storing large volumes of unstructured logs, event streams, or complex AI function outputs that don't fit well into a rigid schema.",
        "pros": [
          "Flexible schema validation",
          "High write throughput for logs",
          "Horizontal scalability"
        ],
        "cons": [
          "Lack of ACID transactions across documents in older versions (though improved)",
          "Data consistency model differs from SQL"
        ]
      }
    ],
    "devops_infrastructure": [
      {
        "name": "AWS (EC2 / Fargate)",
        "category": "DevOps",
        "justification": "Leverages existing mention of S3. Provides a comprehensive, scalable, and reliable cloud environment. EC2 for the Laravel application and Fargate (ECS) for managed container deployment of the FastAPI microservice simplify operations.",
        "pros": [
          "Vast array of integrated services",
          "High scalability and reliability",
          "S3 for highly durable object storage"
        ],
        "cons": [
          "Can be complex to configure and manage initial setup",     
          "Cost optimization requires continuous monitoring"
        ]
      },
      {
        "name": "Docker",
        "category": "DevOps",
        "justification": "Essential for containerizing the FastAPI microservice, ensuring consistent development and deployment environments, and enabling easy scaling.",
        "pros": [
          "Environment consistency across dev, staging, prod",        
          "Portability and isolation of services",
          "Simplified dependency management"
        ],
        "cons": [
          "Adds a layer of abstraction and learning curve for deployment",
          "Requires orchestration for multiple containers in production"
        ]
      },
      {
        "name": "Redis",
        "category": "DevOps",
        "justification": "Powers Laravel's queue system for asynchronous processing (e.g., AI analysis, email sending), serves as a high-performance cache, and can enable real-time features with Laravel Echo/Websockets for Kanban boards.",
        "pros": [
          "Extremely high performance for caching and queues",        
          "Versatile use cases (cache, message broker, session store)",
          "Simplifies asynchronous task management in Laravel"        
        ],
        "cons": [
          "In-memory data store requires persistence strategies for durability",
          "Can be a single point of failure if not highly available"  
        ]
      },
      {
        "name": "AWS S3",
        "category": "DevOps",
        "justification": "Explicitly required for storing PDF documents (cahiers des charges) and user profile pictures, offering highly scalable, durable, and secure object storage.",
        "pros": [
          "Industry-leading object storage with high durability and availability",
          "Cost-effective for large volumes of unstructured data",    
          "Robust security features and access controls"
        ],
        "cons": [
          "Requires careful IAM policy management",
          "Higher latency than block storage for frequent, small file operations"
        ]
      },
      {
        "name": "AWS SES",
        "category": "DevOps",
        "justification": "For reliable and scalable transactional email sending (user invites, password resets, impediment notifications).",
        "pros": [
          "Highly reliable and scalable email delivery service",      
          "Cost-effective for high volumes of emails",
          "Good deliverability rates"
        ],
        "cons": [
          "Initial setup and domain verification can be time-consuming",
          "Requires integration with backend application"
        ]
      }
    ],
    "architecture_pattern": "Modular Monolith",
    "synergy_explanation": "Next.js (React) provides a dynamic, interactive frontend, consuming APIs from the Laravel backend. Laravel acts as a robust modular monolith, handling core business logic, user management, and project data with PostgreSQL. Critical AI-driven PDF analysis is offloaded to a FastAPI Python microservice via Laravel's Redis-backed queue system, ensuring asynchronous, scalable processing. AWS S3 provides secure file storage, while AWS SES manages reliable email delivery. This blend optimizes for rapid development, leveraging existing expertise, with targeted performance for the specialized AI component, all within a coherent AWS cloud environment."
  },
  "alternative_recommendation": {
    "strategy_name": "The High-Performance Go-Powered Engine",        
    "frontend": [
      {
        "name": "Next.js (React)",
        "category": "Frontend",
        "justification": "Retains the benefits of a modern, performant frontend framework for a rich user experience, ensuring the UI remains cutting-edge and flexible.",
        "pros": [
          "Same as primary recommendation"
        ],
        "cons": [
          "Same as primary recommendation"
        ]
      },
      {
        "name": "TypeScript",
        "category": "Tooling",
        "justification": "Enhances code quality, maintainability, and developer confidence across both frontend and backend (Go also has strong typing), providing robust type checking and better refactoring capabilities.",
        "pros": [
          "Improved code quality and reduced bugs",
          "Better collaboration in larger teams",
          "Self-documenting code with types"
        ],
        "cons": [
          "Adds a compilation step to the development workflow",      
          "Can have a steeper initial learning curve for JavaScript developers"
        ]
      }
    ],
    "backend": [
      {
        "name": "Go (with Gin or Echo framework)",
        "category": "Backend",
        "justification": "Chosen for its superior raw performance, excellent concurrency model, and lower resource consumption, making it ideal for applications requiring high throughput and scalability from the outset. This would replace Laravel for the main application logic.",
        "pros": [
          "Exceptional performance and efficiency",
          "Strong concurrency primitives (goroutines, channels)",     
          "Compiled language results in smaller, faster binaries",    
          "Strong typing for robust applications"
        ],
        "cons": [
          "More verbose for CRUD operations compared to opinionated frameworks like Laravel",
          "Smaller ecosystem of web development frameworks/libraries",
          "Steeper learning curve for teams unfamiliar with Go"       
        ]
      },
      {
        "name": "FastAPI (Python)",
        "category": "Backend",
        "justification": "Remains the optimal choice for the specialized AI/NLP tasks, leveraging Python's strengths in machine learning and data processing.",
        "pros": [
          "Same as primary recommendation"
        ],
        "cons": [
          "Same as primary recommendation"
        ]
      }
    ],
    "database": [
      {
        "name": "PostgreSQL",
        "category": "Database",
        "justification": "A universally compatible, robust, and reliable database choice that integrates well with Go and handles complex data models efficiently.",
        "pros": [
          "Same as primary recommendation"
        ],
        "cons": [
          "Same as primary recommendation"
        ]
      }
    ],
    "devops_infrastructure": [
      {
        "name": "AWS (EKS / Kubernetes)",
        "category": "DevOps",
        "justification": "Provides enterprise-grade container orchestration for high availability, automatic scaling, and advanced traffic management for all Go and Python microservices. Ideal for true microservices architecture.",
        "pros": [
          "High availability and fault tolerance",
          "Advanced scaling and resource management",
          "Standard for complex microservices deployments"
        ],
        "cons": [
          "Significant operational overhead and complexity",
          "Steep learning curve for setup and maintenance",
          "Higher infrastructure costs than simpler setups"
        ]
      },
      {
        "name": "Docker",
        "category": "DevOps",
        "justification": "Essential for containerizing both Go and Python services, providing isolated and reproducible environments for deployment on Kubernetes.",
        "pros": [
          "Same as primary recommendation"
        ],
        "cons": [
          "Same as primary recommendation"
        ]
      },
      {
        "name": "Apache Kafka / AWS SQS",
        "category": "DevOps",
        "justification": "For highly scalable, decoupled message queuing and event streaming, crucial for robust asynchronous communication between microservices (e.g., AI analysis, real-time updates) and handling high data volumes.",
        "pros": [
          "High throughput and low latency messaging",
          "Fault-tolerant and durable message storage (Kafka)",       
          "Enables true event-driven architecture and service decoupling"
        ],
        "cons": [
          "Adds significant architectural and operational complexity",
          "Higher resource consumption and management overhead than Redis queues",
          "Initial setup and configuration can be challenging"        
        ]
      },
      {
        "name": "AWS S3",
        "category": "DevOps",
        "justification": "Consistent and scalable object storage solution for project documents and user media.",
        "pros": [
          "Same as primary recommendation"
        ],
        "cons": [
          "Same as primary recommendation"
        ]
      },
      {
        "name": "AWS SES",
        "category": "DevOps",
        "justification": "For reliable and scalable email delivery, integrating with the Go backend.",
        "pros": [
          "Same as primary recommendation"
        ],
        "cons": [
          "Same as primary recommendation"
        ]
      }
    ],
    "architecture_pattern": "Microservices",
    "synergy_explanation": "Next.js (React) provides a highly interactive and performant frontend. The Go backend delivers superior performance and efficient concurrency for all core business APIs. The specialized FastAPI microservice continues to handle the complex AI processing. All services are containerized with Docker and orchestrated by Kubernetes on AWS EKS, providing a highly scalable and resilient infrastructure. Apache Kafka (or AWS SQS) forms a robust messaging backbone for asynchronous communication and event streaming, enabling a true microservices architecture with decoupled components. AWS S3 provides highly durable storage, and AWS SES ensures reliable email notifications, completing a stack built for high performance and extreme scalability." 
  },
  "risk_assessment": [
    "AI Accuracy and 'Hallucinations': The primary risk lies in the AI's ability to accurately parse diverse PDF formats and reliably generate structured, actionable backlog items without errors or significant omissions. This requires extensive training, prompt engineering, and continuous validation to ensure the tool's core value proposition holds true.",
    "Performance of Asynchronous AI Processing: Extracting text from potentially large PDFs and processing it via an external AI API can be time-consuming. While queues mitigate blocking, ensuring the overall responsiveness and throughput for multiple simultaneous analysis requests will be critical. Monitoring and optimizing the Python microservice is essential.",
    "Real-time Updates and Scalability: Implementing true real-time updates for Kanban boards without over-engineering or creating performance bottlenecks (e.g., with WebSockets) can be challenging, especially as the number of users and tasks grows. Careful design of the WebSocket layer and backend event broadcasting is needed.",
    "Security for Authentication and Sensitive Data: Handling user authentication (JWT), password management (hashing, reset flows), secure file uploads (S3), and protection of AI API keys requires meticulous attention to security best practices (OWASP top 10). Any vulnerabilities could expose sensitive project data or user credentials.",
    "Complexity of Data Modeling for Backlog and Project Entities: The hierarchical nature of Epics, User Stories, and Tasks, along with their relationships to projects, sprints, users, and various attributes (story points, status, priority, time entries), requires a well-designed and flexible PostgreSQL schema that can evolve without major refactors."
  ],
  "junior_developer_tips": [
    "Master Laravel's Eloquent ORM: The project involves complex relationships (Epics, Stories, Tasks, Sprints, Users). A deep understanding of Eloquent relationships (one-to-many, many-to-many) will be crucial for efficient data management and query optimization.",
    "Deep Dive into React State Management: For highly interactive components like Kanban boards and drag & drop prioritization, thoroughly understand React Hooks (useState, useEffect, useContext). Consider learning a lightweight state management library like Zustand or TanStack Query for server state management to keep your components clean and performant.",
    "Focus on API Contract and Testing: With a distinct frontend, backend, and an AI microservice, clearly defined API contracts (using OpenAPI/Swagger) are paramount. Utilize tools like Postman or Insomnia to test API endpoints rigorously before frontend integration.",
    "Prioritize Security Best Practices: Always sanitize user inputs, correctly hash passwords, use environment variables for sensitive API keys (e.g., Gemini API, AWS S3), and implement robust authorization checks on every backend endpoint. Security is not an afterthought.",
    "Get Familiar with Docker Basics: For the Python FastAPI microservice, understanding how to build, run, and troubleshoot Docker containers will be an invaluable skill for local development and deployment."
  ]
};
