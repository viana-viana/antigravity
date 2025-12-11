using System.Collections.Generic;

namespace Mahjong.Core
{
    public class GameState
    {
        public List<Tile> Wall { get; private set; }
        public List<Tile>[] Hands { get; private set; }
        public List<Tile>[] Discards { get; private set; }
        public List<List<Tile>>[] OpenSets { get; private set; } // Chows/Pongs/Kongs exposed by each player

        public int CurrentTurn { get; set; } // 0-3
        public int Dealer { get; private set; }
        public Tile? LastDiscard { get; set; }
        
        // Track who discarded the last tile (for claiming)
        public int LastDiscardPlayerIndex { get; set; }

        public GameState()
        {
            Hands = new List<Tile>[4];
            Discards = new List<Tile>[4];
            OpenSets = new List<List<Tile>>[4];

            for (int i = 0; i < 4; i++)
            {
                Hands[i] = new List<Tile>();
                Discards[i] = new List<Tile>();
                OpenSets[i] = new List<List<Tile>>();
            }
        }

        public void InitializeGame()
        {
            Wall = MahjongLogic.GenerateDeck();
            MahjongLogic.Shuffle(Wall);
            CurrentTurn = 0; // East starts
            Dealer = 0;
            LastDiscard = null;

            // Deal 13 tiles to each player
            for (int i = 0; i < 4; i++)
            {
                Hands[i].Clear();
                Discards[i].Clear();
                OpenSets[i].Clear();

                for (int j = 0; j < 13; j++)
                {
                    DrawTile(i);
                }
            }
            
            // Sort hands initially
            for(int i=0; i<4; i++) Hands[i].Sort();
        }

        public Tile DrawTile(int playerIndex)
        {
            if (Wall.Count == 0) return new Tile(); // Draw game / Exhausted wall

            Tile t = Wall[0];
            Wall.RemoveAt(0);
            Hands[playerIndex].Add(t);
            return t;
        }

        public void DiscardTile(int playerIndex, Tile tile)
        {
            if (Hands[playerIndex].Remove(tile))
            {
                Discards[playerIndex].Add(tile);
                LastDiscard = tile;
                LastDiscardPlayerIndex = playerIndex;
                
                // Sort hand after discard to keep it tidy
                Hands[playerIndex].Sort();
            }
        }
        
        public int TilesRemaining => Wall.Count;
    }
}
