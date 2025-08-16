
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { getBillingData, calculateTotal } from "@/lib/billing-db";
import { getStaff } from "@/lib/staff-db";
import { Banknote, FileSpreadsheet } from "lucide-react";

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 2,
    }).format(amount);
};

export default function AccountsPage() {
    const [loading, setLoading] = useState(true);
    const [financials, setFinancials] = useState({
        totalRevenue: 0,
        salaryExpenses: 0,
        operatingExpenses: 0,
        netProfit: 0,
        accountsReceivable: 0,
    });

    useEffect(() => {
        const calculateFinancials = async () => {
            setLoading(true);
            try {
                const [billingData, staffData] = await Promise.all([getBillingData(), getStaff()]);

                const totalRevenue = billingData
                    .filter(b => b.status === 'Paid')
                    .reduce((sum, b) => sum + calculateTotal(b), 0);

                const accountsReceivable = billingData
                    .filter(b => b.status === 'Due' || b.status === 'Overdue')
                    .reduce((sum, b) => sum + calculateTotal(b), 0);

                const salaryExpenses = staffData.reduce((sum, s) => sum + s.payroll.salary, 0) * 12; // Annualized
                
                // Placeholder for other operational expenses
                const operatingExpenses = 500000; // e.g., rent, utilities, marketing for the year

                const totalExpenses = salaryExpenses + operatingExpenses;
                const netProfit = totalRevenue - totalExpenses;

                setFinancials({
                    totalRevenue,
                    salaryExpenses,
                    operatingExpenses,
                    netProfit,
                    accountsReceivable,
                });

            } catch (error) {
                console.error("Failed to calculate financials", error);
            } finally {
                setLoading(false);
            }
        };

        calculateFinancials();
    }, []);

    // Placeholder data for Balance Sheet
    const fixedAssets = { building: 5000000, furniture: 500000, equipment: 200000 };
    const totalFixedAssets = Object.values(fixedAssets).reduce((a, b) => a + b, 0);
    const cash = financials.netProfit > 0 ? financials.netProfit * 0.5 : 50000; // Assuming 50% of profit is cash
    const totalCurrentAssets = cash + financials.accountsReceivable;
    const totalAssets = totalFixedAssets + totalCurrentAssets;

    const liabilities = { loans: 1000000 };
    const ownersEquity = { capital: 4000000, retainedEarnings: financials.netProfit };
    const totalLiabilities = Object.values(liabilities).reduce((a, b) => a + b, 0);
    const totalEquity = Object.values(ownersEquity).reduce((a, b) => a + b, 0);
    const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;


    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <FileSpreadsheet className="h-6 w-6" />
                        <div>
                            <CardTitle>Financial Accounts</CardTitle>
                            <CardDescription>
                                An overview of the academy's financial performance and position.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Profit & Loss Statement</CardTitle>
                        <CardDescription>For the Current Financial Year (Annualized)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? <Skeleton className="h-64 w-full" /> : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Particulars</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow className="font-semibold bg-muted/50">
                                        <TableCell>Revenue</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="pl-8">Total Fees Collected</TableCell>
                                        <TableCell className="text-right">{formatCurrency(financials.totalRevenue)}</TableCell>
                                    </TableRow>
                                    <TableRow className="font-semibold">
                                        <TableCell>Total Revenue</TableCell>
                                        <TableCell className="text-right">{formatCurrency(financials.totalRevenue)}</TableCell>
                                    </TableRow>
                                    
                                     <TableRow className="font-semibold bg-muted/50">
                                        <TableCell>Expenses</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                     <TableRow>
                                        <TableCell className="pl-8">Salary Expenses</TableCell>
                                        <TableCell className="text-right">{formatCurrency(financials.salaryExpenses)}</TableCell>
                                    </TableRow>
                                     <TableRow>
                                        <TableCell className="pl-8">Operating Expenses</TableCell>
                                        <TableCell className="text-right">{formatCurrency(financials.operatingExpenses)}</TableCell>
                                    </TableRow>
                                    <TableRow className="font-semibold">
                                        <TableCell>Total Expenses</TableCell>
                                        <TableCell className="text-right">{formatCurrency(financials.salaryExpenses + financials.operatingExpenses)}</TableCell>
                                    </TableRow>

                                    <TableRow className="font-bold text-base border-t-2">
                                        <TableCell>Net Profit / (Loss)</TableCell>
                                        <TableCell className={`text-right ${financials.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {formatCurrency(financials.netProfit)}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Balance Sheet</CardTitle>
                        <CardDescription>As at the End of the Financial Year</CardDescription>
                    </CardHeader>
                    <CardContent>
                         {loading ? <Skeleton className="h-64 w-full" /> : (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold mb-2">Assets</h4>
                                    <Table>
                                        <TableBody>
                                            <TableRow className="font-medium bg-muted/30"><TableCell colSpan={2}>Current Assets</TableCell></TableRow>
                                            <TableRow><TableCell>Cash</TableCell><TableCell className="text-right">{formatCurrency(cash)}</TableCell></TableRow>
                                            <TableRow><TableCell>Accounts Receivable</TableCell><TableCell className="text-right">{formatCurrency(financials.accountsReceivable)}</TableCell></TableRow>
                                            <TableRow className="font-semibold border-t"><TableCell>Total Current Assets</TableCell><TableCell className="text-right">{formatCurrency(totalCurrentAssets)}</TableCell></TableRow>
                                            
                                            <TableRow className="font-medium bg-muted/30"><TableCell colSpan={2}>Fixed Assets</TableCell></TableRow>
                                            <TableRow><TableCell>Building & Premises</TableCell><TableCell className="text-right">{formatCurrency(fixedAssets.building)}</TableCell></TableRow>
                                            <TableRow><TableCell>Furniture & Fixtures</TableCell><TableCell className="text-right">{formatCurrency(fixedAssets.furniture)}</TableCell></TableRow>
                                            <TableRow><TableCell>Equipment</TableCell><TableCell className="text-right">{formatCurrency(fixedAssets.equipment)}</TableCell></TableRow>
                                            <TableRow className="font-semibold border-t"><TableCell>Total Fixed Assets</TableCell><TableCell className="text-right">{formatCurrency(totalFixedAssets)}</TableCell></TableRow>
                                            
                                            <TableRow className="font-bold text-base border-t-2"><TableCell>Total Assets</TableCell><TableCell className="text-right">{formatCurrency(totalAssets)}</TableCell></TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                                 <div>
                                    <h4 className="font-semibold mb-2">Liabilities & Equity</h4>
                                    <Table>
                                        <TableBody>
                                             <TableRow className="font-medium bg-muted/30"><TableCell colSpan={2}>Liabilities</TableCell></TableRow>
                                             <TableRow><TableCell>Loans Payable</TableCell><TableCell className="text-right">{formatCurrency(liabilities.loans)}</TableCell></TableRow>
                                             <TableRow className="font-semibold border-t"><TableCell>Total Liabilities</TableCell><TableCell className="text-right">{formatCurrency(totalLiabilities)}</TableCell></TableRow>

                                             <TableRow className="font-medium bg-muted/30"><TableCell colSpan={2}>Owner's Equity</TableCell></TableRow>
                                             <TableRow><TableCell>Owner's Capital</TableCell><TableCell className="text-right">{formatCurrency(ownersEquity.capital)}</TableCell></TableRow>
                                             <TableRow><TableCell>Retained Earnings</TableCell><TableCell className="text-right">{formatCurrency(ownersEquity.retainedEarnings)}</TableCell></TableRow>
                                             <TableRow className="font-semibold border-t"><TableCell>Total Equity</TableCell><TableCell className="text-right">{formatCurrency(totalEquity)}</TableCell></TableRow>
                                             
                                             <TableRow className="font-bold text-base border-t-2"><TableCell>Total Liabilities & Equity</TableCell><TableCell className="text-right">{formatCurrency(totalLiabilitiesAndEquity)}</TableCell></TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                         )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
