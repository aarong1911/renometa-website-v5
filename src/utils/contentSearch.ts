
import { websiteContent } from '@/data/websiteContent';

/**
 * Search through the website content knowledge base to find relevant information
 * for user queries
 */
export const findRelevantContent = (query: string): string => {
  const lowercaseQuery = query.toLowerCase();
  let responses: string[] = [];
  
  // Function to search and match content
  const searchContent = (obj: any, path: string = '') => {
    if (typeof obj === 'string' && obj.toLowerCase().includes(lowercaseQuery)) {
      responses.push(obj);
      return;
    }
    
    if (typeof obj !== 'object' || obj === null) return;
    
    // For arrays or objects
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;
      
      // Match on the key name itself
      if (key.toLowerCase().includes(lowercaseQuery)) {
        if (typeof value === 'string') {
          responses.push(value);
        } else if (Array.isArray(value) && typeof value[0] === 'object') {
          // For arrays of objects (like FAQs)
          const summaries = value.map(item => 
            Object.values(item).filter(v => typeof v === 'string').join(': ')
          ).join(' | ');
          responses.push(`About ${key}: ${summaries}`);
        }
      }
      
      // Recursively search nested content
      searchContent(value, currentPath);
    }
  };
  
  // Search all website content
  searchContent(websiteContent);
  
  // Special handling for questions that might be FAQs
  if (lowercaseQuery.includes('?') || 
      lowercaseQuery.includes('how') || 
      lowercaseQuery.includes('what') || 
      lowercaseQuery.includes('when') || 
      lowercaseQuery.includes('why') || 
      lowercaseQuery.includes('who') || 
      lowercaseQuery.includes('where') || 
      lowercaseQuery.includes('can')) {
    
    // Search through all FAQ sections to find potential answers
    for (const section in websiteContent.serviceFAQs) {
      const faqs = websiteContent.serviceFAQs[section as keyof typeof websiteContent.serviceFAQs];
      for (const faq of faqs) {
        if (faq.question.toLowerCase().includes(lowercaseQuery) || 
            lowercaseQuery.includes(faq.question.toLowerCase().replace(/[?.,]/g, ''))) {
          responses.push(`Q: ${faq.question}\nA: ${faq.answer}`);
        }
      }
    }
    
    // General FAQs
    for (const [question, answer] of Object.entries(websiteContent.faq)) {
      if (lowercaseQuery.includes(question)) {
        responses.push(answer);
      }
    }
  }
  
  // Check for service-specific queries
  const serviceTerms = ['website', 'seo', 'ai', 'automation', 'integration', 'performance'];
  for (const term of serviceTerms) {
    if (lowercaseQuery.includes(term)) {
      // Add service description if available
      if (websiteContent.services[term as keyof typeof websiteContent.services]) {
        responses.push(websiteContent.services[term as keyof typeof websiteContent.services]);
      }
      
      // Add features if the query seems to be about features
      if (lowercaseQuery.includes('feature') || lowercaseQuery.includes('benefit') || lowercaseQuery.includes('offer')) {
        const features = websiteContent.features[term as keyof typeof websiteContent.features];
        if (features) {
          responses.push(`Key features of our ${term} service: ${features.map(f => f.title + ' - ' + f.description).join(' | ')}`);
        }
      }
      
      // Add process information if the query seems to be about process
      if (lowercaseQuery.includes('process') || lowercaseQuery.includes('steps') || lowercaseQuery.includes('how do you')) {
        const process = websiteContent.process[term as keyof typeof websiteContent.process];
        if (process) {
          responses.push(`Our ${term} process: ${process.map(p => p.stepNumber + '. ' + p.title + ' - ' + p.description).join(' | ')}`);
        }
      }
    }
  }
  
  // Check for solution-specific queries
  const solutionCategories = ['crm', 'sales', 'marketing', 'jobs'];
  for (const category of solutionCategories) {
    if (lowercaseQuery.includes(category)) {
      // Add solution overview
      if (websiteContent.solutions[category as keyof typeof websiteContent.solutions]) {
        const solution = websiteContent.solutions[category as keyof typeof websiteContent.solutions];
        responses.push(solution.overview);
        
        // Add specific solution details if mentioned
        for (const [key, value] of Object.entries(solution)) {
          if (key !== 'overview' && lowercaseQuery.includes(key)) {
            responses.push(`${key}: ${value}`);
          }
        }
      }
    }
  }
  
  // If we have responses, join them with separators for better readability
  if (responses.length > 0) {
    // If we have too many responses, limit and prioritize the most relevant ones
    if (responses.length > 3) {
      // Sort by relevance (simple word match count)
      responses = responses.sort((a, b) => {
        const aMatches = lowercaseQuery.split(' ')
          .filter(word => a.toLowerCase().includes(word)).length;
        const bMatches = lowercaseQuery.split(' ')
          .filter(word => b.toLowerCase().includes(word)).length;
        return bMatches - aMatches;
      }).slice(0, 3); // Take top 3
    }
    
    return responses.join('\n\n');
  }
  
  // Default response for unknown queries
  return "I can help you learn more about our services for remodeling and home service businesses. We offer Website Development, SEO, AI-Powered Agents, Intelligent Automation, Seamless Integration, and Performance Optimization. What specific aspect of our solutions would you like to know about?";
};
