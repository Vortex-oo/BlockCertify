// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";

contract BlockCertify is Ownable(msg.sender) {
    struct University {
        string name;
        bool isRegistered;
    }

    struct Certificate {
        string studentName;
        string courseName;
        string certHash;
        uint256 issueDate;
        string university;
        bool isValid;
    }

    mapping(address => University) universities;
    mapping(string => Certificate) certificates; //Certificate => certHash(created in the backend)

    event universityAdded(address indexed uni, string uniName);
    event universityRemoved(address indexed uni, string uniName);
    event addCertificate(string indexed certHash, string uniName);

    modifier onlyUniversity() {
        require(
            universities[msg.sender].isRegistered,
            "Not a registered university"
        );
        _;
    }

    // ---- University Management ----

    function addUniversity(
        address _uni,
        string memory _uniName
    ) public onlyOwner {
        universities[_uni] = University(_uniName, true);
        emit universityAdded(_uni, _uniName);
    }

    function removeUniversity(address _uni) public onlyOwner {
        string memory uniName = universities[_uni].name;
        delete universities[_uni];
        emit universityRemoved(_uni, uniName);
    }

    function isUniversity(address _uni) public view returns (bool) {
        return universities[_uni].isRegistered;
    }

    // ---- Certificate Management ----

    function createCertificates(
        string memory _stdName,
        string memory _courseName,
        string memory _certHash
    ) public onlyUniversity {
        require(!certificates[_certHash].isValid, "Certificate already exists");

        certificates[_certHash] = Certificate(
            _stdName,
            _courseName,
            _certHash,
            block.timestamp,
            universities[msg.sender].name,
            true
        );

        emit addCertificate(_certHash, msg.sender);
    }

    function verifyCertificate(
        string memory _certHash
    ) public view returns (bool, Certificate memory) {
        Certificate memory cert = certificates[_certHash];
        return (cert.isValid, cert);
    }
}
