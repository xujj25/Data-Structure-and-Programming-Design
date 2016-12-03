#include <iostream>
#include <string>
#include "familyTree.hpp"
using namespace std;



void welcomePage() {
	cout << "-------------------------------------------------------" << endl;
	cout << endl;
	cout << "Welcome to use Family Tree Management Systen V1.0" << endl;
	cout << endl;
	cout << "-------------------------------------------------------" << endl;
}

string showMenu() {
	cout << endl;
	cout << "Build Family Tree: " << endl;
	cout << endl;
	cout << "Menu:" << endl;
	cout << endl;
	cout << "command    function" << endl;
	cout << "a          add member" << endl;
	cout << "d          delete member" << endl;
	cout << "c          get member number" << endl;
	cout << "q          query member" << endl;
	cout << "p          print Family Tree" << endl;
	cout << "o          quit the program" << endl;
	cout << endl;
	cout << "-------------------------------------------------------" << endl;
	string command;
	cin >> command;
	if (command == "a" || command == "d" || command == "c" ||
		command == "q" || command == "p" || command == "o") {
		return command;
	} else {
		command = "";
		return "";
	}
}

void quitPage() {
	cout << "-------------------------------------------------------" << endl;
	cout << endl;
	cout << "See you next time!" << endl;
	cout << endl;
	cout << "-------------------------------------------------------" << endl;
}

string getCommand() {
	string command;
	while (true) {
		command = showMenu();
		if (command != "") {
			return command;
		} else {
			cout << "Please input the correct command!" << endl;
			cout << endl;
			cout << "-------------------------------------------------------" << endl;
		}
	}
}

bool operationOnChoice(string command, familyTree& ft) {
	cout << "-------------------------------------------------------" << endl;
	bool runningFlag = true;
	if (command == "a") {
		ft.addMember();
	} else if (command == "d") {
		ft.deleteMember();
	} else if (command == "c") {
		ft.showMemberCount();
	} else if (command == "q") {
		ft.queryMember();
	} else if (command == "p") {
		ft.printFamilyTree();
	} else if (command == "o") {
		quitPage();
		runningFlag = false;
	}
	cout << "-------------------------------------------------------" << endl;
	return runningFlag;
}

void ui() {
	familyTree ft;
	string command;
	bool runningFlag = true;
	welcomePage();

	while (runningFlag) {
		command = getCommand();
		runningFlag = operationOnChoice(command, ft);
	}
}

int main(int argc, char const *argv[])
{
	ui();
	return 0;
}

