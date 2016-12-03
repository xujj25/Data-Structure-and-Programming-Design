#include <iostream>
#include <string>
using namespace std;
struct Date
{
	int year, month, day;
	Date(int y = 0, int m = 0, int d = 0) {
		year = y;
		month = m;
		day = d;
	}
};

struct PersonalData
{
	string name;
	Date birth;
	Date death;
	PersonalData(string n = "", Date b = Date(), Date d = Date()) {
		name = n;
		birth = b;
		death = d;
	}
};

struct MemberNode
{
	// int memNumber;
	PersonalData data;
	MemberNode* oldestChild;
	MemberNode* father;
	MemberNode *olderBrother, *littleBrother;
	MemberNode(PersonalData dt, MemberNode* oc = NULL, MemberNode* f = NULL,
			 MemberNode* ob = NULL, MemberNode* lb = NULL) {
		// memNumber = num;
		data = dt;
		oldestChild = oc;
		father = f;
		olderBrother = ob;
		littleBrother = lb;
	}
};

class familyTree
{
 public:
	familyTree();
	~familyTree();

	PersonalData makeDataByName(string memName);

	void addMember();
	bool addMemberByFather(PersonalData memData, string fatherName);
	bool addMemberByOlderBrother(PersonalData memData, string brotherName);

	void deleteMember();
	bool deleteMemberByName(string memName);

	int getMemberCount();
	void showMemberCount();

	void queryMember();
	void query(MemberNode* node, string memName);
	bool queryMemberByName(string memName);
	bool queryFather(string memName);
	bool queryBrothers(string memName);
	bool queryChildren(string memName);

	void tipForCommand(bool flag);
	void printFamilyTree();
	void showPersonalData(MemberNode* node);

 private:
 	MemberNode* rootMemberNode;
 	MemberNode* queryNode;
 	int memberCount;
};


familyTree::familyTree() : rootMemberNode(NULL), memberCount(0), queryNode(NULL) {}
familyTree::~familyTree() {
	// 清空树
	if (rootMemberNode != NULL) deleteMemberByName((rootMemberNode -> data).name);
}

PersonalData familyTree::makeDataByName(string memName) {
		int y, m, d;
		cout << "Please input the member's btirhday, format like this: " << endl;
		cout << "2000 12 31" << endl;
		cin >> y >> m >> d;
		Date birthday = Date(y, m, d);
		cout << "if the member is still alive, please input: 0 0 0" << endl;
		cout << "else, input the death time, format like the brithday: " << endl;
		cin >> y >> m >> d;
		Date deathday = Date(y, m, d);
		return PersonalData(memName, birthday, deathday);	
}

void familyTree::addMember() {
/*			添加成员
				若根成员为空，添加根成员

				否则，选单如下
					根据父亲添加
					根据哥哥添加
*/	if (!rootMemberNode) {
		string rootName;
		cout << "The family tree is empty now, put add the root member first!" << endl;
		cout << "The root member can only have children and little brothers" << endl;
		cout << "Please input the root member's name: " << endl;
		cin >> rootName;
		rootMemberNode = new MemberNode(makeDataByName(rootName));
		memberCount++;
		tipForCommand(true);
	} else {
		cout << "Add member: " << endl;
		cout << "Menu: " << endl;
		cout << endl;
		cout << "command    function" << endl;
		cout << "f          add for father" << endl;
		cout << "b          add for older brother" << endl;
		string command;
		cin >> command;
		if (command == "f") {
			string fatherName, memName;
			cout << "Please input the father's name: " << endl;
			cin >> fatherName;
			/*查找是否存在 之后再进行添加操作*/
			if (!queryMemberByName(fatherName)) {
				cout << "This father does not exist!" << endl;
			} else {
				cout << "Please input the corresponding member's name: " << endl;
				cin >> memName;
				tipForCommand(addMemberByFather(makeDataByName(memName), fatherName));
			}

		} else if (command == "b") {
			string brotherName, memName;
			cout << "Please input the older brother's name:" << endl;
			cin >> brotherName;
			/*查找是否存在 之后再进行添加操作*/
			if (!queryMemberByName(brotherName)) {
				cout << "This older brother does not exist!" << endl;
			} else {
				cout << "Please input the corresponding member's name: " << endl;
				cin >> memName;
				tipForCommand(addMemberByOlderBrother(makeDataByName(memName), brotherName));
			}

		} else {
			tipForCommand(false);
		}
	}
}

bool familyTree::addMemberByFather(PersonalData memData, string fatherName) {
// 注意：添加成员的时候 创建成员节点的时候有两个参数，第一个为成员序号，第二个为想要添加的成员的数据
// 找到对应的父亲，然后找到其oldestChild的最小弟弟，加在其后，可以直接调用函数
	queryMemberByName(fatherName);
	MemberNode* tempNode = queryNode;
	if (tempNode -> oldestChild == NULL) {
		MemberNode* newMember = new MemberNode(memData);
		tempNode -> oldestChild = newMember;
		newMember -> father = tempNode;
		memberCount++;  // if success
	} else {
		addMemberByOlderBrother(memData, (tempNode -> oldestChild -> data).name);
	}
	return true;
}

bool familyTree::addMemberByOlderBrother(PersonalData memData, string brotherName) {
// 注意：添加成员的时候 创建成员节点的时候有两个参数，第一个为成员序号，第二个为想要添加的成员的数据
	queryMemberByName(brotherName);
	MemberNode* tempNode = queryNode;
	while (tempNode -> littleBrother != NULL) {
		tempNode = tempNode -> littleBrother;
	}
	MemberNode* newMember = new MemberNode(memData);
	tempNode -> littleBrother = newMember;
	newMember -> olderBrother = tempNode;
	memberCount++;  // if success
	return true;
}

void familyTree::deleteMember() {
	cout << "Delete member:" << endl;
	if (memberCount == 0) {
		cout << "The family tree is empty now, nobody can be deleted!" << endl;
		return;
	}
	cout << "Please input the name of the member you want to delete:" << endl;
	string memName;
	cin >> memName;
	if (!queryMemberByName(memName)) {
		cout << "The member you want to delete does not exist!" << endl;
	} else {
		tipForCommand(deleteMemberByName(memName));
	}
}

bool familyTree::deleteMemberByName(string memName) {
	queryMemberByName(memName);
	MemberNode * elder = queryNode->olderBrother, * younger = queryNode->littleBrother, * temp = queryNode->oldestChild, * A = queryNode;
	
	
	if (temp != NULL) {
		while (temp -> littleBrother) temp = temp -> littleBrother;  // temp为最后一个孩子

		while (temp) {
			MemberNode * B = temp -> olderBrother;
			deleteMemberByName((temp -> data).name);
			temp = B;
		}
	}

	if (A == rootMemberNode) {
		rootMemberNode = NULL;
		delete A;
	} else {
		
		if (elder && younger) {
			elder -> littleBrother = younger;
			younger -> olderBrother = elder;
		} else if (elder && younger == NULL) {
			elder -> littleBrother = NULL;
		} else if (elder == NULL && younger) {
			A -> father -> oldestChild = younger;
			younger -> father = A -> father;
			younger -> olderBrother = NULL;
		} else if (elder == NULL && younger == NULL) {
			A -> father -> oldestChild = NULL;
		}
		
		delete A;
	}

	memberCount--;  // if success
}

int familyTree::getMemberCount() {
	return memberCount;
}

void familyTree::showMemberCount() {
	cout << "The number of members now is " << getMemberCount() << endl;
}

void familyTree::queryMember() {
	// 		查询成员
	cout << "Query member:" << endl;
	//			查询成员信息
	// 			查询成员的父亲
	// 			查询成员的兄弟
	cout << "Menu:" << endl;
	cout << endl;
	cout << "command    function" << endl;
	cout << "i          query the information of the specified member" << endl;
	cout << "f          query the father of the specified member" << endl;
	cout << "b          query the brothers of the specified member" << endl;
	cout << "c          query member's sons" << endl;
	string command;
	cin >> command;
	if (command == "i" || command == "f" || command == "b" || command == "c") {
		cout << "Please input the name of the corresponding member:" << endl;
		string memName;
		cin >> memName;
		if (!queryMemberByName(memName)) {
			cout << "The member does not exist!" << endl;
		} else if (command == "i") {
			showPersonalData(queryNode);
		} else if (command == "f") {
			if (!queryFather(memName)) {
				cout << "The member's father does not exist!" << endl;
			}
		} else if (command == "b") {
			if (!queryBrothers(memName)) {
				cout << "The member's brother does not exist!" << endl;
			}
		} else if (command == "c") {
			if (!queryChildren(memName)) {
				cout << "Member's sons not exist!" << endl;
			}
		}
	} else {
		tipForCommand(false);
	}
}

void familyTree::query(MemberNode* node, string memName) {
// 最底层查找函数
	if (node == NULL) {
		return;
	}
	if ((node -> data).name == memName) {
		queryNode = node;
		return;
	}
	query(node -> oldestChild, memName);
	query(node -> littleBrother, memName);
}

bool familyTree::queryMemberByName(string memName) {
// 由于不是查找树，节点的查找只能使用遍历。
	queryNode = NULL;
	query(rootMemberNode, memName);
	return (queryNode != NULL);
}

bool familyTree::queryFather(string memName) {
	queryMemberByName(memName);
	MemberNode* tempNode = queryNode;
	while (tempNode -> olderBrother != NULL) {
		tempNode = tempNode -> olderBrother;
	}
	if (tempNode -> father != NULL) {
		showPersonalData(tempNode -> father);
		return true;
	} else {
		return false;
	}
}

bool familyTree::queryBrothers(string memName) {
	queryMemberByName(memName);
	MemberNode* tempNode = queryNode;
	if (tempNode == NULL) {
		return false;
	}
	while (tempNode -> olderBrother != NULL) {
		tempNode = tempNode -> olderBrother;
	}
	while (tempNode != NULL) {
		showPersonalData(tempNode);
		tempNode = tempNode -> littleBrother;
	}
	return true;
}

bool familyTree::queryChildren(string memName) {
	queryMemberByName(memName);
	MemberNode* tempNode = queryNode -> oldestChild;
	if (tempNode == NULL) {
		return false;
	} else {
		queryBrothers((tempNode -> data).name);
		return true;
	}
}

void bfs(MemberNode* root, string space) {
	MemberNode* temp = root;
	while (temp) {
		if ((temp -> data).death.year == 0) {
			cout << space << (temp -> data).name << endl;
		} else {
			cout << space << "#" << (temp -> data).name << endl;
		}
		bfs(temp -> oldestChild, space + "\t");
		temp = temp -> littleBrother;
	}
}
void familyTree::printFamilyTree() {
	cout << "The number of members in our family is  " << memberCount << endl;
	cout << "The relationship can be shown as follows: (\"#\" for someone is dead) " << endl;
	bfs(rootMemberNode, "\t");
}

void familyTree::tipForCommand(bool flag) {
	if (flag) {
		cout << "Success!" << endl;
	} else {
		cout << "Please input the correct command!" << endl;
	}
	cout << endl;
	cout << "-------------------------------------------------------" << endl;
}

void familyTree::showPersonalData(MemberNode* node) {
	cout << endl;
	cout << "Personal Data: " << endl;
	cout << "Name: " << (node -> data).name << endl;
	cout << "Birthday: " << (node -> data).birth.year
	 << " " << (node -> data).birth.month << " " << (node -> data).birth.day << endl;
	if ((node -> data).death.year != 0 || (node -> data).death.month != 0 || (node -> data).death.day != 0) {
		cout << "Deathday: " << (node -> data).death.year
	 		<< " " << (node -> data).death.month << " " << (node -> data).death.day << endl;		
	}
	cout << endl;
}