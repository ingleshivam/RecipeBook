"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  ChefHat,
  Search,
  Filter,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  Eye,
  MoreHorizontal,
  TrendingUp,
  Star,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";

const pendingRecipes = [
  {
    id: 1,
    title: "Authentic Italian Carbonara",
    author: "Marco Rossi",
    authorEmail: "marco@email.com",
    submittedAt: "2024-01-15T10:30:00Z",
    category: "Main Course",
    difficulty: "Medium",
    prepTime: "15 min",
    cookTime: "20 min",
    servings: 4,
    image: "/placeholder.svg?height=200&width=300",
    status: "pending",
    description:
      "Traditional Roman carbonara with eggs, pecorino cheese, and guanciale.",
  },
  {
    id: 2,
    title: "Vegan Chocolate Brownies",
    author: "Sarah Green",
    authorEmail: "sarah@email.com",
    submittedAt: "2024-01-14T15:45:00Z",
    category: "Desserts",
    difficulty: "Easy",
    prepTime: "20 min",
    cookTime: "35 min",
    servings: 12,
    image: "/placeholder.svg?height=200&width=300",
    status: "pending",
    description: "Rich, fudgy brownies made with plant-based ingredients.",
  },
  {
    id: 3,
    title: "Thai Green Curry",
    author: "Ploy Siriporn",
    authorEmail: "ploy@email.com",
    submittedAt: "2024-01-13T09:15:00Z",
    category: "Main Course",
    difficulty: "Hard",
    prepTime: "30 min",
    cookTime: "25 min",
    servings: 6,
    image: "/placeholder.svg?height=200&width=300",
    status: "pending",
    description:
      "Authentic Thai green curry with fresh herbs and coconut milk.",
  },
];

const stats = {
  totalRecipes: 1247,
  pendingReviews: 23,
  approvedToday: 8,
  totalUsers: 5432,
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());
export default function AdminPage() {
  const {
    data: response,
    isLoading: responseLoading,
    error: responseError,
  } = useSWR("/api/getRecipeDeatils", fetcher);

  const {
    data: userData,
    isLoading: userDataLoading,
    error: userDataError,
  } = useSWR("/api/getUserDetails", fetcher);

  console.log("Response :", response);
  console.log("userData :", userData);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("pending");

  const handleApprove = (recipeId: number) => {
    // Handle approval logic
  };

  const handleReject = (recipeId: number) => {
    // Handle rejection logic
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white px-30">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Manage recipe submissions and community content
          </p>
        </div>

        {/* Stats Cards */}
        {!responseLoading && !userDataLoading ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Recipes</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {response.result.length}
                      </p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <ChefHat className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Pending Reviews</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {
                          response.result.filter(
                            (item: any) => item.approvedStatus === "U"
                          ).length
                        }
                      </p>
                    </div>
                    <div className="bg-orange-100 p-3 rounded-full">
                      <Clock className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Approved Today</p>
                      <p className="text-2xl font-bold text-green-600">
                        {
                          response.result.filter((item: any) => {
                            const today = new Date();
                            const approvedDate = new Date(item.approvedDate);
                            return (
                              approvedDate.toDateString() ===
                              today.toDateString()
                            );
                          }).length
                        }
                      </p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Users</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {userData.response.length}
                      </p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-full">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs
              value={selectedTab}
              onValueChange={setSelectedTab}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <TabsList className="grid w-full sm:w-auto grid-cols-3">
                  <TabsTrigger value="pending">
                    Pending ({stats.pendingReviews})
                  </TabsTrigger>
                  <TabsTrigger value="approved">Approved</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>

                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-80">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search recipes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>

              <TabsContent value="pending" className="space-y-6">
                <Card className="p-6">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-800">
                      Pending Recipe Reviews
                    </CardTitle>
                    <CardDescription>
                      Review and approve new recipe submissions from the
                      community
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {pendingRecipes.map((recipe) => (
                        <div
                          key={recipe.id}
                          className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col lg:flex-row gap-6">
                            {/* Recipe Image */}
                            <div className="lg:w-48 flex-shrink-0">
                              <Image
                                src={recipe.image || "/placeholder.svg"}
                                alt={recipe.title}
                                width={300}
                                height={200}
                                className="w-full h-32 lg:h-32 object-cover rounded-lg"
                              />
                            </div>

                            {/* Recipe Details */}
                            <div className="flex-1 space-y-4">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                <div>
                                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    {recipe.title}
                                  </h3>
                                  <p className="text-gray-600 mb-3">
                                    {recipe.description}
                                  </p>
                                  <div className="flex flex-wrap gap-2 mb-3">
                                    <Badge
                                      variant="secondary"
                                      className="bg-orange-100 text-orange-700"
                                    >
                                      {recipe.category}
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="border-green-200 text-green-700"
                                    >
                                      {recipe.difficulty}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex flex-col sm:items-end">
                                  <p className="text-sm text-gray-500 mb-1">
                                    Submitted by
                                  </p>
                                  <p className="font-medium text-gray-800">
                                    {recipe.author}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {recipe.authorEmail}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {formatDate(recipe.submittedAt)}
                                  </p>
                                </div>
                              </div>

                              {/* Recipe Stats */}
                              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4" />
                                  <span>Prep: {recipe.prepTime}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4" />
                                  <span>Cook: {recipe.cookTime}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Users className="h-4 w-4" />
                                  <span>{recipe.servings} servings</span>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex flex-wrap gap-3 pt-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-green-500 hover:bg-green-600 text-white"
                                  onClick={() => handleApprove(recipe.id)}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-red-200 text-red-600 hover:bg-red-50"
                                  onClick={() => handleReject(recipe.id)}
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {pendingRecipes.length === 0 && (
                      <div className="text-center py-12">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          All caught up!
                        </h3>
                        <p className="text-gray-600">
                          No pending recipes to review at the moment.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="approved" className="space-y-6">
                <Card className="p-6">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-800">
                      Approved Recipes
                    </CardTitle>
                    <CardDescription>
                      Recently approved recipes that are now live on the
                      platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Approved Recipes
                      </h3>
                      <p className="text-gray-600">
                        View and manage all approved recipes here.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="rejected" className="space-y-6">
                <Card className="p-6">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-800">
                      Rejected Recipes
                    </CardTitle>
                    <CardDescription>
                      Recipes that were rejected and the reasons for rejection
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Rejected Recipes
                      </h3>
                      <p className="text-gray-600">
                        View rejected recipes and rejection reasons here.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">
                  Quick Actions
                </CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <Users className="h-6 w-6" />
                    <span>Manage Users</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <Star className="h-6 w-6" />
                    <span>Featured Recipes</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <TrendingUp className="h-6 w-6" />
                    <span>Analytics</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          "Loading..."
        )}
      </div>
    </div>
  );
}
