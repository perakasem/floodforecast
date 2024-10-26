# 0 is empty
# player 1 is 1: "X"
# player 2 is 2: "O"

# empty board 
board = [[0, 0, 0],
         [0, 0, 0],
         [0, 0, 0]]

run_game = True
player = 1
player1_name = ''
player2_name = ''

def turn(row: int, column: int, player: int, board: list[list[int]]) -> bool: 
    if row > 3 or column > 3:  # checking if the move is out of range 
        return False
    elif board[row - 1][column - 1] == 1 or board[row - 1][column - 1] == 2:  # checking if a player has already played on that square
        return False

    # actually inputting the move
    if player == 1: 
        board[row - 1][column - 1] = 1
        return True
    elif player == 2: 
        board[row - 1][column - 1] = 2
        return True
    else: 
        return False
    

while run_game: 
    turn_so_far = 0
    move_validity = False

    if turn_so_far == 0: 
        if player1_name == '': 
            player1_name = input("Please enter your name, player 1: ").upper()
        if player2_name == '':
            player2_name = input("Please enter your name, player 2: ").upper()
        turn_so_far += 1

    while not move_validity: 
        if player == 1: 
            row, column = int(input(f"{player1_name},enter the row you would play in: ")), \
                int(input(f"{player1_name}, enter the column you would like to player in: "))
            move_validity = turn(row, column, player, board)
        elif player == 2: 
            row, column = int(input(f"{player2_name}, enter the row you would play in: ")), \
                int(input(f"{player2_name}, enter the column you would like to player in: "))
            move_validity = turn(row, column, player, board)
    
    turn_so_far += 1
    if player == 1: 
        player = 2
    else: 
        player = 1

    for row in board: 
        print(row)