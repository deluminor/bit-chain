'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Budget } from '@/features/finance/queries/budget';
import { formatEuroAmount } from '@/lib/currency';
import { Clock, Edit, MoreHorizontal, Plus, Trash2 } from 'lucide-react';

interface BudgetTemplatesCardProps {
  templates: Budget[] | undefined;
  isApplyingTemplate: boolean;
  onApplyTemplate: (template: Budget) => void;
  onCreateTemplate: () => void;
}

export function BudgetTemplatesCard({
  templates,
  isApplyingTemplate,
  onApplyTemplate,
  onCreateTemplate,
}: BudgetTemplatesCardProps) {
  return (
    <Card className="shadow-md rounded-lg hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Monthly Budget Templates
        </CardTitle>
        <CardDescription>Templates for automatically creating monthly budgets</CardDescription>
      </CardHeader>
      <CardContent>
        {templates && templates.length > 0 ? (
          <div className="space-y-4">
            {templates.map(template => (
              <div
                key={template.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <div>
                      <h4 className="font-medium">{template.templateName || template.name}</h4>
                      <div className="text-sm text-muted-foreground">
                        {template.categories.length} categories •{' '}
                        {formatEuroAmount(template.totalPlannedBase ?? template.totalPlanned)} total
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onApplyTemplate(template)}
                    disabled={isApplyingTemplate}
                  >
                    {isApplyingTemplate ? 'Creating...' : 'Apply for This Month'}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Template
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Template
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-muted-foreground mb-4">No budget templates created yet</div>
            <p className="text-sm text-muted-foreground mb-4">
              Create a budget and mark it as a template to reuse it monthly
            </p>
            <Button onClick={onCreateTemplate}>
              <Plus className="h-4 w-4 mr-2" />
              Create Budget Template
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
