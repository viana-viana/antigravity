using System;
using System.Collections.Generic;
using System.Linq;

namespace Mahjong.Core
{
    public static class MahjongLogic
    {
        // Generate a full set of 136 tiles (no flowers/seasons for now)
        public static List<Tile> GenerateDeck()
        {
            List<Tile> deck = new List<Tile>();
            int idCounter = 0;

            // Suits 1-9
            foreach (Suit suit in new[] { Suit.Bamboo, Suit.Character, Suit.Dot })
            {
                for (int val = 1; val <= 9; val++)
                {
                    for (int i = 0; i < 4; i++) deck.Add(new Tile(suit, val, idCounter++));
                }
            }

            // Winds 1-4
            for (int val = 1; val <= 4; val++)
            {
                for (int i = 0; i < 4; i++) deck.Add(new Tile(Suit.Wind, val, idCounter++));
            }

            // Dragons 1-3
            for (int val = 1; val <= 3; val++)
            {
                for (int i = 0; i < 4; i++) deck.Add(new Tile(Suit.Dragon, val, idCounter++));
            }

            return deck;
        }

        public static void Shuffle<T>(IList<T> list)
        {
            Random rng = new Random();
            int n = list.Count;
            while (n > 1)
            {
                n--;
                int k = rng.Next(n + 1);
                T value = list[k];
                list[k] = list[n];
                list[n] = value;
            }
        }

        // --- Set Checking Logic ---

        public static bool CanPong(List<Tile> hand, Tile target)
        {
            return hand.Count(t => t.Equals(target)) >= 2;
        }

        public static bool CanKong(List<Tile> hand, Tile target)
        {
            return hand.Count(t => t.Equals(target)) >= 3;
        }

        public static bool CanChow(List<Tile> hand, Tile target)
        {
            if (target.IsHonor) return false; // Cannot Chow honors

            // Need to check for neighbors (e.g. if target is 3, need 1,2 or 2,4 or 4,5)
            // Simplified check: do we have tiles that can form a run with target?
            // This is complex because we need to know WHICH chow. 
            // For "CanChow" generally, we just check if ANY exist.
            
            var sameSuit = hand.Where(t => t.Suit == target.Suit).Select(t => t.Value).ToHashSet();
            int v = target.Value;

            bool c1 = sameSuit.Contains(v - 2) && sameSuit.Contains(v - 1); // 1,2, [3]
            bool c2 = sameSuit.Contains(v - 1) && sameSuit.Contains(v + 1); // 2, [3], 4
            bool c3 = sameSuit.Contains(v + 1) && sameSuit.Contains(v + 2); // [3], 4, 5

            return c1 || c2 || c3;
        }

        // --- Win Checking Logic (Recursive) ---

        public static bool CheckWin(List<Tile> hand)
        {
            // Standard Mahjong: 4 sets + 1 pair = 14 tiles.
            // Hand passed here should be 14 tiles (13 standing + 1 drawn/claimed).
            if (hand.Count % 3 != 2) return false;

            // Sort for easier processing
            List<Tile> sortedHand = new List<Tile>(hand);
            sortedHand.Sort();

            return CheckStandardWin(sortedHand);
        }

        private static bool CheckStandardWin(List<Tile> tiles)
        {
            if (tiles.Count == 0) return true;

            // Try to find a pair first if we have 14, 11, 8, 5, 2 tiles... 
            // Actually, standard recursion usually removes the pair first, then checks for sets.
            // But since we recurse, let's stick to a pattern:
            // If count % 3 == 2, we MUST find a pair.
            // If count % 3 == 0, we MUST find a set (Chow or Pong).

            if (tiles.Count % 3 == 2)
            {
                // Find Pair
                for (int i = 0; i < tiles.Count - 1; i++)
                {
                    if (tiles[i].Equals(tiles[i + 1]))
                    {
                        // Found potential pair
                        var remaining = new List<Tile>(tiles);
                        remaining.RemoveAt(i);
                        remaining.RemoveAt(i); // Remove the second one (now at i)
                        
                        if (CheckStandardWin(remaining)) return true;
                        
                        // Optimization: Skip identical tiles to avoid redundant checks
                        while (i < tiles.Count - 2 && tiles[i].Equals(tiles[i+2])) i++;
                    }
                }
                return false;
            }
            else
            {
                // Find Set (Pong or Chow)
                Tile first = tiles[0];

                // 1. Try Pong (AAA)
                if (tiles.Count >= 3 && tiles[1].Equals(first) && tiles[2].Equals(first))
                {
                    var remaining = new List<Tile>(tiles);
                    remaining.RemoveRange(0, 3);
                    if (CheckStandardWin(remaining)) return true;
                }

                // 2. Try Chow (ABC) - Only for suits
                if (!first.IsHonor)
                {
                    // Find first + 1
                    int idx2 = -1;
                    int idx3 = -1;

                    for(int i=1; i<tiles.Count; i++)
                    {
                        if (tiles[i].Suit == first.Suit && tiles[i].Value == first.Value + 1) 
                        {
                            if (idx2 == -1) idx2 = i;
                        }
                        else if (tiles[i].Suit == first.Suit && tiles[i].Value == first.Value + 2)
                        {
                            if (idx3 == -1) idx3 = i;
                            break; // Found both
                        }
                    }

                    if (idx2 != -1 && idx3 != -1)
                    {
                        var remaining = new List<Tile>(tiles);
                        // Remove in reverse order to keep indices valid
                        remaining.RemoveAt(idx3);
                        remaining.RemoveAt(idx2);
                        remaining.RemoveAt(0);
                        if (CheckStandardWin(remaining)) return true;
                    }
                }

                return false;
            }
        }
    }
}
