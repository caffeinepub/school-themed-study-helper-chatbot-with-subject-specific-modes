import Text "mo:core/Text";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type Mode = {
    #mathHelp;
    #socialStudiesHelp;
    #scienceHelp;
    #languageArtsHelp;
  };

  type ChatHistory = {
    mode : Mode;
    entries : [(Text, Text)]; // (user message, bot response)
  };

  type ChatSessionState = {
    sessions : Map.Map<Principal, [(Mode, ChatHistory)]>;
  };

  module ChatSessionState {
    public func init() : ChatSessionState {
      { sessions = Map.empty<Principal, [(Mode, ChatHistory)]>() };
    };

    public func getOrEmpty(state : ChatSessionState, user : Principal) : [(Mode, ChatHistory)] {
      switch (state.sessions.get(user)) {
        case (null) { [] };
        case (?entries) { entries };
      };
    };

    public func update(state : ChatSessionState, user : Principal, newMode : Mode, newHistory : ChatHistory) {
      let existingEntries = getOrEmpty(state, user);
      let filteredEntries = existingEntries.filter(
        func(entry) {
          entry.0 != newMode;
        }
      );
      state.sessions.add(
        user,
        [(newMode, newHistory)].concat(filteredEntries)
      );
    };

    public func getHistory(state : ChatSessionState, user : Principal, mode : Mode) : ?ChatHistory {
      let entries = getOrEmpty(state, user);
      switch (entries.find<(Mode, ChatHistory)>(func((m, _)) { m == mode })) {
        case (?(_, history)) { ?history };
        case (null) { null };
      };
    };
  };

  let chatSessionState = ChatSessionState.init();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public type ChatRequest = {
    mode : Mode;
    message : Text;
    context : ?Text;
  };

  public type ChatResponse = {
    response : Text;
    mode : Mode;
    history : [(Text, Text)];
  };

  func modeToText(mode : Mode) : Text {
    switch (mode) {
      case (#mathHelp) { "Math Help" };
      case (#socialStudiesHelp) { "Social Studies Help" };
      case (#scienceHelp) { "Science Help" };
      case (#languageArtsHelp) { "Language Arts Help" };
    };
  };

  func getModeIntro(mode : Mode) : Text {
    switch (mode) {
      case (#mathHelp) {
        "Welcome to Math Help! I will guide you step-by-step. Please provide your math problem.";
      };
      case (#socialStudiesHelp) {
        "Welcome to Social Studies Help! Let me know your topic or question, and I'll assist you.";
      };
      case (#scienceHelp) {
        "Welcome to Science Help! Ask your question, and I will help with hypotheses, evidence, and conclusions.";
      };
      case (#languageArtsHelp) {
        "Welcome to Language Arts Help! Please share your reading or writing task.";
      };
    };
  };

  func getModeTemplate(mode : Mode, userMessage : Text) : Text {
    switch (mode) {
      case (#mathHelp) {
        "Step 1: Understand the problem.\n" # userMessage # "\n\nStep 2: Let's break it down. (Further math logic processing needed)\n";
      };
      case (#socialStudiesHelp) {
        "Topic:  " # userMessage # "\n\nTimeline and key concepts (Further social studies logic needed)\n";
      };
      case (#scienceHelp) {
        "Step 1: Clarify the question.\n" # userMessage # "\n\nStep 2: Hypothesis and evidence. (Further science logic needed)\n";
      };
      case (#languageArtsHelp) {
        "Step 1: Identify the task.\n" # userMessage # "\n\nStep 2: Thesis, outline, and revision checklist. (Further language arts logic needed)\n";
      };
    };
  };

  func processMessage(request : ChatRequest, currentHistory : [(Text, Text)]) : [(Text, Text)] {
    [("", getModeIntro(request.mode)), (request.message, getModeTemplate(request.mode, request.message))].concat(currentHistory);
  };

  public shared ({ caller }) func chat(request : ChatRequest) : async ChatResponse {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can chat");
    };

    // Get current history for the mode
    let modeHistory = if (request.context == null) {
      switch (ChatSessionState.getHistory(chatSessionState, caller, request.mode)) {
        case (?history) { history.entries };
        case (null) { [] };
      };
    } else {
      [];
    };

    let updatedHistory = processMessage(request, modeHistory);

    // Update persistent chat session state for the caller
    let newHistory : ChatHistory = {
      mode = request.mode;
      entries = updatedHistory;
    };

    ChatSessionState.update(chatSessionState, caller, request.mode, newHistory);

    let response : ChatResponse = {
      response = getModeTemplate(request.mode, request.message);
      mode = request.mode;
      history = updatedHistory.reverse<(Text, Text)>();
    };

    response;
  };

  public query ({ caller }) func getModePageIntroduction(mode : Mode) : async Text {
    getModeIntro(mode);
  };
};
