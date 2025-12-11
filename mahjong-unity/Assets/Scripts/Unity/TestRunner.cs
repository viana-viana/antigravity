using UnityEngine;
using System.Collections.Generic;
using Mahjong.Core;

namespace Mahjong.Unity
{
    public class TestRunner : MonoBehaviour
    {
        void Start()
        {
            RunTests();
        }

        void RunTests()
        {
            Debug.Log("Running Mahjong Logic Tests...");

            TestWinCheck();
            TestPongCheck();
            TestChowCheck();
        }

        void TestWinCheck()
        {
            // Test 1: Simple Win (11 123 123 123 123)
            List<Tile> hand = new List<Tile>();
            hand.Add(new Tile(Suit.Bamboo, 1)); hand.Add(new Tile(Suit.Bamboo, 1)); // Pair
            
            // 4 Sets of 123
            for(int i=0; i<4; i++) {
                hand.Add(new Tile(Suit.Dot, 1));
                hand.Add(new Tile(Suit.Dot, 2));
                hand.Add(new Tile(Suit.Dot, 3));
            }

            bool result = MahjongLogic.CheckWin(hand);
            Debug.Log($"Test Win (Standard): {result} (Expected: True)");
            
            // Test 2: Incomplete Hand
            hand.RemoveAt(0); // Remove one of the pair
            hand.Add(new Tile(Suit.Bamboo, 5)); // Add random tile
            result = MahjongLogic.CheckWin(hand);
            Debug.Log($"Test Win (Incomplete): {result} (Expected: False)");
        }

        void TestPongCheck()
        {
            List<Tile> hand = new List<Tile>();
            hand.Add(new Tile(Suit.Dragon, 1)); // Red Dragon
            hand.Add(new Tile(Suit.Dragon, 1));
            
            bool canPong = MahjongLogic.CanPong(hand, new Tile(Suit.Dragon, 1));
            Debug.Log($"Test Pong: {canPong} (Expected: True)");
        }

        void TestChowCheck()
        {
            List<Tile> hand = new List<Tile>();
            hand.Add(new Tile(Suit.Bamboo, 2));
            hand.Add(new Tile(Suit.Bamboo, 3));
            
            bool canChow = MahjongLogic.CanChow(hand, new Tile(Suit.Bamboo, 1));
            Debug.Log($"Test Chow (1,2,3): {canChow} (Expected: True)");
        }
    }
}
