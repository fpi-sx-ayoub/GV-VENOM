import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Zap, LogOut, Send } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function VipDashboard() {
  const [, setLocation] = useLocation();
  const [uid, setUid] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const sendLikesMutation = trpc.vip.sendLikes.useMutation({
    onSuccess: (data) => {
      toast.success("Likes sent successfully!");
      setResult(data.data);
      setUid("");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send likes");
    },
  });

  const logoutMutation = trpc.vip.logout.useMutation({
    onSuccess: () => {
      toast.success("Logged out successfully");
      setLocation("/");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uid) {
      toast.error("Please enter a Player ID");
      return;
    }

    setIsLoading(true);
    try {
      await sendLikesMutation.mutateAsync({ uid });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-purple-500/20 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-8 h-8 text-purple-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              GV VENOM
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
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Send Likes Form */}
          <div>
            <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm">
              <div className="p-8 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Send Likes</h2>
                  <p className="text-slate-400">Enter your Free Fire Player ID</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Player ID (UID)
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g., 13708567247"
                      value={uid}
                      onChange={(e) => setUid(e.target.value)}
                      disabled={isLoading}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 h-auto"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Likes
                      </>
                    )}
                  </Button>
                </form>

                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                  <p className="text-sm text-slate-300">
                    <span className="font-semibold text-purple-400">Tip:</span> Make sure you enter the correct Player ID to receive likes
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Results */}
          <div>
            {result ? (
              <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20 backdrop-blur-sm">
                <div className="p-8 space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">Results</h3>
                    <div className="text-sm font-semibold text-green-400">Success!</div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                      <div className="text-xs text-slate-400 mb-1">Player Nickname</div>
                      <div className="text-lg font-bold text-white">{result.playerNickname}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                        <div className="text-xs text-slate-400 mb-1">Likes Before</div>
                        <div className="text-2xl font-bold text-white">{result.likesBefore}</div>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                        <div className="text-xs text-slate-400 mb-1">Likes After</div>
                        <div className="text-2xl font-bold text-green-400">{result.likesAfter}</div>
                      </div>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                      <div className="text-xs text-slate-400 mb-1">Likes Given</div>
                      <div className="text-2xl font-bold text-purple-400">+{result.likesGiven}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                        <div className="text-xs text-slate-400 mb-1">Successful Requests</div>
                        <div className="text-lg font-bold text-white">{result.successfulRequests}</div>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                        <div className="text-xs text-slate-400 mb-1">Tokens Used</div>
                        <div className="text-lg font-bold text-white">{result.totalTokensUsed}</div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-4 border border-purple-500/30 mt-4">
                      <div className="text-center">
                        <div className="text-xs text-slate-400 mb-1">Service Provider</div>
                        <div className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                          {result.brandName}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => setResult(null)}
                    variant="outline"
                    className="w-full border-slate-600 text-slate-300 hover:bg-slate-700/50"
                  >
                    Send More Likes
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm">
                <div className="p-8 flex items-center justify-center h-full min-h-96">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-8 h-8 text-purple-400" />
                    </div>
                    <p className="text-slate-400">Send likes to see results here</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
