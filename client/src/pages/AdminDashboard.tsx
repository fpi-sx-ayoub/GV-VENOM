import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Shield, LogOut, Trash2, Plus } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [days, setDays] = useState("30");
  const [isLoading, setIsLoading] = useState(false);

  const { data: users, refetch } = trpc.admin.getUsers.useQuery();

  const addUserMutation = trpc.admin.addUser.useMutation({
    onSuccess: () => {
      toast.success("User added successfully!");
      setUsername("");
      setPassword("");
      setDays("30");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add user");
    },
  });

  const deleteUserMutation = trpc.admin.deleteUser.useMutation({
    onSuccess: () => {
      toast.success("User deleted successfully!");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete user");
    },
  });

  const logoutMutation = trpc.admin.logout.useMutation({
    onSuccess: () => {
      toast.success("Logged out successfully");
      setLocation("/");
    },
  });

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || !days) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      await addUserMutation.mutateAsync({
        username,
        password,
        days: parseInt(days),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      await deleteUserMutation.mutateAsync({ id });
    }
  };

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isExpired = (expiryDate: Date) => {
    return new Date(expiryDate) < new Date();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-red-500/20 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-red-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Admin Panel
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-red-500 text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Add User Form */}
          <div className="md:col-span-1">
            <Card className="bg-slate-800/50 border-red-500/20 backdrop-blur-sm">
              <div className="p-8 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Add New User</h2>
                  <p className="text-slate-400 text-sm">Create a new VIP account</p>
                </div>

                <form onSubmit={handleAddUser} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Username
                    </label>
                    <Input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={isLoading}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Password
                    </label>
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Days
                    </label>
                    <Input
                      type="number"
                      placeholder="30"
                      value={days}
                      onChange={(e) => setDays(e.target.value)}
                      disabled={isLoading}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold py-2 h-auto"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Add User
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </Card>
          </div>

          {/* Users List */}
          <div className="md:col-span-2">
            <Card className="bg-slate-800/50 border-red-500/20 backdrop-blur-sm">
              <div className="p-8 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">VIP Users</h2>
                  <p className="text-slate-400 text-sm">Total: {users?.length || 0} users</p>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {users && users.length > 0 ? (
                    users.map((user) => (
                      <div
                        key={user.id}
                        className="bg-slate-700/50 rounded-lg p-4 flex items-center justify-between border border-slate-600 hover:border-red-500/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="font-semibold text-white">{user.username}</div>
                          <div className="text-sm text-slate-400">
                            Expires: {formatDate(user.expiryDate)}
                          </div>
                          {isExpired(user.expiryDate) && (
                            <div className="text-xs text-red-400 font-semibold mt-1">
                              EXPIRED
                            </div>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteUser(user.id)}
                          className="ml-4"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-400">
                      No users yet. Add your first VIP user above.
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
