import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BookOpen, Search } from 'lucide-react';
import { GlossaryTerm } from '@/api/entities';

const GlossaryPage = () => {
  const [terms, setTerms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const mockTerms = [
    { id: 1, term: 'At-Will Employment', definition: 'A contractual relationship in which an employee can be dismissed by an employer for any reason (that is, without having to establish "just cause"), and without warning, as long as the reason is not illegal (e.g. firing because of the employee\'s race, religion or sexuality).', category: 'Legal', marshallese_equivalent: 'Jerbal in an Bwebwenato' },
    { id: 2, 'term': 'Kemem', 'definition': 'A large, celebratory event for a child\'s first birthday, a cornerstone of Marshallese family and community life. It involves significant resource and time commitment from the family.', 'category': 'Cultural Concept', 'marshallese_equivalent': 'Kemem' },
    { id: 3, 'term': 'Irooj', 'definition': 'The traditional chiefs of the Marshall Islands, who hold significant authority and respect. Obligations to the Irooj are a vital part of cultural life.', 'category': 'Cultural Concept', 'marshallese_equivalent': 'Irooj' }
  ];

  useEffect(() => {
    // In a real app, you would fetch from the GlossaryTerm entity
    // const loadTerms = async () => {
    //   setIsLoading(true);
    //   const data = await GlossaryTerm.list();
    //   setTerms(data);
    //   setIsLoading(false);
    // }
    // loadTerms();
    setTerms(mockTerms);
    setIsLoading(false);
  }, []);

  const filteredTerms = terms.filter(item => 
    item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.marshallese_equivalent && item.marshallese_equivalent.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
          Glossary
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          A guide to important HR, Legal, and Cultural terms in the Marshall Islands context.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input 
          placeholder="Search terms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white/70 dark:bg-slate-700/70 border-gray-200 dark:border-slate-600"
        />
      </div>

      <div className="space-y-4">
        {isLoading ? (
            <p>Loading terms...</p>
        ) : (
            filteredTerms.map(item => (
              <Card key={item.id} className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900 dark:text-white">{item.term}</CardTitle>
                  {item.marshallese_equivalent && (
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                      {item.marshallese_equivalent}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300">{item.definition}</p>
                  <p className="text-xs text-gray-500 mt-3 uppercase font-semibold">{item.category}</p>
                </CardContent>
              </Card>
            ))
        )}
      </div>
    </div>
  );
};

export default GlossaryPage;